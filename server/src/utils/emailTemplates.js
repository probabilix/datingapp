const brandColor = '#E94057';

const getBaseTemplate = (title, bodyContent, actionButton = null) => `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    
    <!-- Branding Header -->
    <div style="background-color: ${brandColor}; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 28px;">Dating Advice</h1>
    </div>

    <!-- Content Body -->
    <div style="padding: 40px 30px; color: #333333;">
      <h2 style="color: #12172D; font-size: 22px; margin-top: 0; margin-bottom: 20px;">${title}</h2>
      <div style="line-height: 1.6; font-size: 16px; color: #555555;">
        ${bodyContent}
      </div>

      ${actionButton ? `
        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
          <a href="${actionButton.url}" style="display: inline-block; background-color: ${brandColor}; color: #ffffff; padding: 14px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px;">${actionButton.text}</a>
        </div>
      ` : ''}

      <div style="margin-top: 20px; font-size: 14px; color: #888888;">
        <p>If you have any questions, simply reply to this email or contact our support team.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
      <p>&copy; ${new Date().getFullYear()} DatingAdvice.io. All rights reserved.</p>
      <p>123 Love Avenue, Relationship City, RC 10101</p>
    </div>
  </div>
</div>
`;

export const getResetPasswordTemplate = (resetLink) => {
    return getBaseTemplate(
        "Reset Your Password",
        "<p>We received a request to reset the password for your account. No worries, it happens to the best of us!</p><p>Click the button below to securely reset your password. This link is valid for 24 hours.</p>",
        { text: "Reset Password", url: resetLink }
    );
};

export const getWelcomeTemplate = (userName) => {
    const name = userName ? userName.split(' ')[0] : 'there';
    return getBaseTemplate(
        `Welcome, ${name}!`,
        `<p>We are thrilled to have you join our community. Your journey to better relationships and confidence starts now.</p><p>Our AI advisors are ready to chat, listen, and guide you 24/7. Explore our dashboard to get started.</p>`,
        { text: "Go to Dashboard", url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard` }
    );
};
