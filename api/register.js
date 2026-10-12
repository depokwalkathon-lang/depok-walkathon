
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Gunakan metode POST."
    });
  }

  try {
    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;

    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Konfigurasi database belum lengkap."
      });
    }

    return res.status(200).json({
      success: true,
      message: "API Depok Walkathon terhubung dan siap untuk tahap integrasi database.",
      registrationEnabled: false,
      maxParticipants: 4
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server."
    });
  }
}
