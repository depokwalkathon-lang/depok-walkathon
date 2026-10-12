
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

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

    // Pastikan input berbentuk JSON yang benar.
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Format data pendaftaran tidak valid."
      });
    }

    const { fullName, email, phone, participants } = body;

    if (
      typeof fullName !== "string" ||
      typeof phone !== "string" ||
      (email != null && typeof email !== "string") ||
      !Array.isArray(participants) ||
      participants.length < 1 ||
      participants.length > 4 ||
      !participants.every(name => typeof name === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Data pendaftar atau jumlah peserta tidak valid."
      });
    }

    const cleanedName = fullName.trim();
    const cleanedPhone = phone.trim();
    const cleanedEmail = (email || "").trim();
    const cleanedParticipants = participants.map(name => name.trim());

    if (
      cleanedName.length < 2 ||
      cleanedName.length > 150 ||
      cleanedPhone.length < 8 ||
      cleanedPhone.length > 25 ||
      cleanedEmail.length > 254 ||
      (cleanedEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) ||
      cleanedParticipants.some(
        name => name.length < 2 || name.length > 150
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Mohon periksa kembali data pendaftaran."
      });
    }

    const supabaseResponse = await fetch(
      `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/rpc/create_walkathon_registration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SECRET_KEY,
          "Authorization": `Bearer ${SUPABASE_SECRET_KEY}`
        },
        body: JSON.stringify({
          p_full_name: cleanedName,
          p_email: cleanedEmail,
          p_phone: cleanedPhone,
          p_participants: cleanedParticipants
        }),
        signal: AbortSignal.timeout(8000)
      }
    );

    const result = await supabaseResponse.json();

    if (!supabaseResponse.ok) {
      console.error(
        "Supabase registration error:",
        result.code || supabaseResponse.status
      );

      const allowedMessages = [
        "Data pendaftar tidak valid",
        "Jumlah peserta harus 1 sampai 4",
        "Nama peserta tidak valid",
        "Kuota peserta tidak mencukupi"
      ];

      const safeMessage = allowedMessages.includes(result.message)
        ? result.message
        : "Pendaftaran belum dapat diproses. Silakan coba lagi.";

      return res.status(
        result.message === "Kuota peserta tidak mencukupi" ? 409 : 400
      ).json({
        success: false,
        message: safeMessage
      });
    }

    if (!result || result.success !== true) {
      return res.status(502).json({
        success: false,
        message: "Respons database tidak valid."
      });
    }

    return res.status(201).json(result);

  } catch (error) {
    console.error("Registration API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server."
    });
  }
}
