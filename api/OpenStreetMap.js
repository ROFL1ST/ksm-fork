const axios = require("axios");

/**
 * Get formatted address from latitude and longitude
 * using OpenStreetMap (Nominatim) reverse geocoding API
 */
exports.getAddressFromCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "express-geolocation-demo",
        },
      }
    );

    const data = response.data;
    const address = data.address || {};
    const formattedAddress = [
      data.display_name?.split(",").slice(0, 2).join(", ") || "", // baris 1: alamat umum (misal nama jalan)
      `Desa: ${address.village || "-"}, Kode Pos: ${address.postcode || "-"}`, // baris 2: desa & kode pos
      `Kecamatan: ${address.city_district || "-"}, Kota: ${
        address.city || "-"
      }, Provinsi: ${address.state || "-"}`, // baris 3: kecamatan, kota, provinsi
      `${lat}, ${lon}`, // baris 4: koordinat
    ];
    return {
      status: true,
      response: formattedAddress,
      messages: "Successfully Get Location From OpenStreetMap",
    };
  } catch (err) {
    console.error("Error getting address:", err.message);
    return { status: false, response: err, messages: err.message };
  }
};
