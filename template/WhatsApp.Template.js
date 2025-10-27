const { FonteWhatsApp } = require("../api/Fonte");

exports.RegisterAccountTemplate = async (params) => {
  const message = {
    phone: params.phone,
    messages: `
    Hallo Berikut Akun KSM :

    Email : ${params.email}
    Password : ${params.password}

    #kelolaSemuaMudah
    `,
  };
  return await FonteWhatsApp(message);
};
exports.BlastTravelDocumentWarehouseTemplate = async (params) => {
  const message = {
    phone: params.phone,
    messages: `
    *WAREHOUSE INFORMATION*
    
    Halo ${params.name},

    Berikut adalah informasi terkait *Barang Keluar* Anda:

    • Kode Barang Keluar : ${params.travel_code}
    • Kode Purchase Order : ${params.purchase_order_client_code}

    Terima kasih atas kerja sama dan kepercayaannya.

    #KelolaSemuaMudah
    `,
  };
  return await FonteWhatsApp(message);
};
exports.BlastTravelDocumentDriverTemplate = async (params) => {
  const phone = params.client_phone;
  const formattedPhone = phone.startsWith("0") ? "62" + phone.slice(1) : phone;

  const message = {
    phone: params.phone,
    messages: `
    *DRIVER INFORMATION*
    
    Halo ${params.name},

    Berikut adalah informasi terkait Pengantaran Barang :

    • Kode Surat jalan : ${params.travel_code}
    • Klien : ${params.client_name}
    • Chatting Klien : https://wa.me/${formattedPhone}

    • Lokasi Klien : https://www.google.com/maps/place/${params.location}

    Terima kasih atas kerja sama dan kepercayaannya.

    #KelolaSemuaMudah
    `,
  };
  return await FonteWhatsApp(message);
};
exports.BlastProdutcsFollowUPTemplate = async (params) => {
  const message = {
    phone: params.phone,
    messages: `
    *PERMINTAAN PENAMBAHAN STOK PRODUK 📦*
    
    Halo ${params.name},

    Berikut adalah informasi terkait Produk yang harus ditambahkan, dikarnakan kurangnya *Stok*:

    ${params.demand}

    Terima kasih atas kerja sama dan kepercayaannya,Mohon segera ditindak lanjuti oleh tim *Finance* ✅
    
    #KelolaSemuaMudah
    `,
  };
  return await FonteWhatsApp(message);
};
