# EmailJS Setup Guide for Contact Form

## ✅ Installation Complete
EmailJS has been installed and integrated into your Contact Us page!

## 📧 EmailJS Template Setup

### Step 1: Go to EmailJS Dashboard
1. Visit: https://dashboard.emailjs.com/
2. Log in with your account

### Step 2: Create Email Template
1. Click on **"Email Templates"** in the left sidebar
2. Click **"Create New Template"** button
3. Set Template Name: `Contact Form Submission` or any name you like
4. Set Template ID: `template_contact_form` (IMPORTANT: Must match the code!)

### Step 3: Design Your Email Template

Copy and paste this template content:

#### Subject Line:
```
New Contact Form Message from {{name}}
```

#### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 10px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .field {
            margin-bottom: 20px;
        }
        .label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .value {
            padding: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            margin-top: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 New Contact Form Message</h1>
            <p>PrintNSupply - Contact Form</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">👤 From:</div>
                <div class="value">{{name}}</div>
            </div>
            
            <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value">{{email}}</div>
            </div>
            
            <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">{{message}}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent from PrintNSupply Contact Form</p>
            <p>Reply directly to this email to respond to the customer</p>
        </div>
    </div>
</body>
</html>
```

#### Alternative Simple Plain Text Template:
```
New Contact Form Submission
━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Customer Details:
━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: {{name}}
📧 Email: {{email}}

💬 Message:
━━━━━━━━━━━━━━━━━━━━━━━━━
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━
This message was sent from PrintNSupply Contact Form.
Reply directly to respond to the customer.
```

### Step 4: Configure Template Variables
Make sure these variables are in your template:
- `{{name}}` - Customer's name
- `{{email}}` - Customer's email  
- `{{message}}` - Customer's message

### Step 5: Set "Reply To" Field
In the template settings:
- Set **Reply To**: `{{email}}`
- This allows you to reply directly to the customer

### Step 6: Test Your Template
1. Click **"Test It"** button
2. Fill in sample values:
   - name: John Doe
   - email: test@example.com
   - message: This is a test message
3. Click "Send Test"
4. Check your email inbox

### Step 7: Save Template
Click **"Save"** at the top right

## 🔑 Your Configuration (Already Set in Code)

```javascript
Service ID: service_pji711e
Template ID: template_contact_form  // ⚠️ Must create this in EmailJS
Public Key: pNve9185cw30hDUqv
```

## ✨ Features Implemented

1. ✅ **EmailJS Integration** - Sends emails directly from frontend
2. ✅ **Success Message** - Green toast notification on successful send
3. ✅ **Loading State** - "Sending..." button state while processing
4. ✅ **Form Reset** - Automatically clears form after successful send
5. ✅ **Error Handling** - Shows alert if email fails to send
6. ✅ **Form Validation** - Required fields with HTML5 validation
7. ✅ **Auto-hide Success** - Success message disappears after 5 seconds

## 🎨 UI Features

- Beautiful gradient header
- Responsive design (mobile & desktop)
- Smooth animations
- Professional styling
- Loading state during send
- Success toast notification with checkmark icon

## 🧪 Testing Your Contact Form

1. Go to http://localhost:5174/contact
2. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Message: Test message
3. Click "Send Message"
4. You should see:
   - Button changes to "Sending..."
   - Green success toast appears
   - Form clears automatically
5. Check your EmailJS account's email for the message!

## 🔧 Troubleshooting

### If emails aren't sending:

1. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for error messages

2. **Verify EmailJS Settings**
   - Service ID is correct: `service_pji711e`
   - Template ID exists: `template_contact_form`
   - Public Key is correct: `pNve9185cw30hDUqv`

3. **Check EmailJS Dashboard**
   - Go to "Email Services" → Gmail
   - Make sure service is connected
   - Check if there are any errors

4. **Template Variables**
   - Ensure template uses: `{{name}}`, `{{email}}`, `{{message}}`
   - Variable names must match exactly

5. **Form Field Names**
   - Each input has `name` attribute matching template variables

## 📊 EmailJS Free Tier Limits

- **200 emails/month** for free
- Upgrade for more: https://www.emailjs.com/pricing/

## 🎯 Next Steps

1. ✅ Install EmailJS - DONE
2. ✅ Update ContactUs.tsx - DONE  
3. ⏳ Create template in EmailJS dashboard - DO THIS NOW
4. ⏳ Test the contact form
5. ✅ Deploy and enjoy!

## 📝 Template Quick Create Steps

1. Go to: https://dashboard.emailjs.com/admin/templates
2. Click: "Create New Template"
3. Name: "Contact Form"
4. Template ID: `template_contact_form`
5. Copy the HTML template above
6. Save
7. Test!

---

**Need Help?** 
- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/
