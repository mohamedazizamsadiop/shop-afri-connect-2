import express from "express";
import sendEmail from "../utils/email.js";

const router = express.Router();

// POST /api/emails/send-code
router.post("/send-code", async (req, res) => {
  const { to, code } = req.body || {};
  const recipient = to || process.env.DEFAULT_RECIPIENT || "mohamedazizamsadiopdiop@gmail.com";
  const codeValue = code || process.env.DEFAULT_CODE || "cuhi uynr wncg qzwb";

  try {
    const subject = "Votre code";
    const html = `<p>Bonjour,</p><p>Voici votre code : <strong>${codeValue}</strong></p>`;
    const text = `Voici votre code : ${codeValue}`;

    const { info, previewUrl } = await sendEmail({
      to: recipient,
      subject,
      text,
      html,
    });

    return res.json({ ok: true, messageId: info.messageId, previewUrl });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
