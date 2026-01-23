const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Email configuration
let transporter = null;

const createTransporter = (gmailUser, gmailAppPassword) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    }
  });
};

// Store email settings per user
const emailSettingsFile = path.join(DATA_DIR, 'email-settings.json');

const loadEmailSettings = () => {
  try {
    if (fs.existsSync(emailSettingsFile)) {
      return JSON.parse(fs.readFileSync(emailSettingsFile, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading email settings:', error);
  }
  return {};
};

const saveEmailSettings = (settings) => {
  try {
    fs.writeFileSync(emailSettingsFile, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving email settings:', error);
  }
};

// API Routes

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Save email settings for a user
app.post('/api/email-settings', async (req, res) => {
  try {
    const { userId, gmailUser, gmailAppPassword, emailNotifications, recipientEmail } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const settings = loadEmailSettings();
    settings[userId] = {
      gmailUser,
      gmailAppPassword,
      emailNotifications,
      recipientEmail: recipientEmail || gmailUser,
      updatedAt: new Date().toISOString()
    };
    saveEmailSettings(settings);

    // Test the connection if credentials provided
    if (gmailUser && gmailAppPassword) {
      try {
        const testTransporter = createTransporter(gmailUser, gmailAppPassword);
        await testTransporter.verify();
        res.json({ success: true, message: 'Email settings saved and verified' });
      } catch (verifyError) {
        res.json({
          success: true,
          warning: 'Settings saved but could not verify email connection. Please check your credentials.',
          error: verifyError.message
        });
      }
    } else {
      res.json({ success: true, message: 'Email settings saved' });
    }
  } catch (error) {
    console.error('Error saving email settings:', error);
    res.status(500).json({ error: 'Failed to save email settings' });
  }
});

// Send a test email
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { userId } = req.body;
    const settings = loadEmailSettings();
    const userSettings = settings[userId];

    if (!userSettings || !userSettings.gmailUser || !userSettings.gmailAppPassword) {
      return res.status(400).json({ error: 'Email settings not configured' });
    }

    const transporter = createTransporter(userSettings.gmailUser, userSettings.gmailAppPassword);

    const mailOptions = {
      from: `"Home Hub" <${userSettings.gmailUser}>`,
      to: userSettings.recipientEmail,
      subject: 'Test Email from Home Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #38bdf8 0%, #4ade80 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Home Hub</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Test Email Successful!</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              This is a test email from your Home Hub app. If you received this, your email notifications are configured correctly.
            </p>
            <p style="color: #6b7280; line-height: 1.6;">
              You will receive reminders for maintenance tasks one week before they're due and on the due date.
            </p>
            <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 8px;">
              <p style="color: #0284c7; margin: 0; font-size: 14px;">
                <strong>Sent at:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

// Fetch link preview metadata
app.get('/api/link-preview', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HomeHub/1.0; +http://localhost)',
        'Accept': 'text/html'
      },
      timeout: 5000
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Parse Open Graph and meta tags
    const getMetaContent = (property) => {
      const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`, 'i'));
      if (ogMatch) return ogMatch[1];

      const ogMatch2 = html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${property}["']`, 'i'));
      if (ogMatch2) return ogMatch2[1];

      const nameMatch = html.match(new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'));
      if (nameMatch) return nameMatch[1];

      return null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = getMetaContent('title') || (titleMatch ? titleMatch[1] : null);
    const description = getMetaContent('description');
    let image = getMetaContent('image');

    // Make image URL absolute if it's relative
    if (image && !image.startsWith('http')) {
      const urlObj = new URL(url);
      image = image.startsWith('/')
        ? `${urlObj.protocol}//${urlObj.host}${image}`
        : `${urlObj.protocol}//${urlObj.host}/${image}`;
    }

    res.json({
      success: true,
      data: {
        title: title?.trim(),
        description: description?.trim(),
        image,
        url
      }
    });
  } catch (error) {
    console.error('Error fetching link preview:', error);
    res.json({
      success: false,
      error: error.message,
      data: { url: req.query.url }
    });
  }
});

// Send task reminder email
app.post('/api/send-reminder', async (req, res) => {
  try {
    const { userId, task, reminderType } = req.body;
    const settings = loadEmailSettings();
    const userSettings = settings[userId];

    if (!userSettings || !userSettings.emailNotifications) {
      return res.json({ success: false, message: 'Email notifications disabled' });
    }

    if (!userSettings.gmailUser || !userSettings.gmailAppPassword) {
      return res.json({ success: false, message: 'Email not configured' });
    }

    const transporter = createTransporter(userSettings.gmailUser, userSettings.gmailAppPassword);

    const isUrgent = reminderType === 'due-today';
    const subject = isUrgent
      ? `⚠️ Task Due Today: ${task.name}`
      : `📅 Upcoming Task: ${task.name}`;

    const priorityColors = {
      high: '#ef4444',
      medium: '#fbbf24',
      low: '#22c55e'
    };

    const mailOptions = {
      from: `"Home Hub" <${userSettings.gmailUser}>`,
      to: userSettings.recipientEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #38bdf8 0%, #4ade80 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Home Hub</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: ${isUrgent ? '#fef3c7' : '#e0f2fe'}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: ${isUrgent ? '#b45309' : '#0284c7'}; margin: 0 0 5px 0; font-size: 18px;">
                ${isUrgent ? '⚠️ Task Due Today' : '📅 Task Due in 1 Week'}
              </h2>
            </div>

            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">${task.name}</h3>

            ${task.description ? `<p style="color: #6b7280; line-height: 1.6; margin: 0 0 15px 0;">${task.description}</p>` : ''}

            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
              <span style="background: ${priorityColors[task.priority]}20; color: ${priorityColors[task.priority]}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                ${task.priority.toUpperCase()} PRIORITY
              </span>
              <span style="background: #dbeafe; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                ${task.category}
              </span>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                <strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
                <strong>Frequency:</strong> ${task.frequency}
              </p>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; text-align: center;">
              This is an automated reminder from your Home Hub app.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Home Hub Email Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
