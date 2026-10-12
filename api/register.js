
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Gunakan metode POST."
    });
  }

  return res.status(200).json({
    success: true,
    message: "API Depok Walkathon berhasil terhubung. Mode pengujian.",
    registrationEnabled: false,
    maxParticipants: 4
  });
}
