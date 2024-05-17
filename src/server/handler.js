const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    // Prediksi klasifikasi menggunakan model dan gambar
    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);

    // Membuat ID unik dan timestamp untuk data prediksi
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Menyiapkan data untuk disimpan
    const data = {
        "id": id,
        "result": label,
        "explanation": explanation,
        "suggestion": suggestion,
        "confidenceScore": confidenceScore,
        "createdAt": createdAt
    };

    // Simpan data menggunakan fungsi storeData
    await storeData(id, data);

    // Siapkan respons
    const response = h.response({
        status: 'success',
        message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
        data
    });
    response.code(201);
    return response;
}

module.exports = postPredictHandler;
