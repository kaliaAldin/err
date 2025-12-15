// Data normalization: turns API payload into frontend-friendly arrays.

export function handleHospitalData(payload){
  if (!payload?.Hospitals) return [];
  return payload.Hospitals.map(hospital => {
    const geolocation = String(hospital.GPS_Location || "")
      .split(',')
      .map(coord => parseFloat(coord.trim()));

    if (geolocation.length === 2 && !isNaN(geolocation[0]) && !isNaN(geolocation[1])) {
      return {
        name: hospital.name,
        geolocation,
        status: hospital.Status,
        district: hospital.District,
        controlledBy: hospital.Controlled_By
      };
    }
    console.error("Invalid GPSLocation data for hospital:", hospital?.name);
    return null;
  }).filter(Boolean);
}

export function handleEmergencyRoomData(payload){
  if (!payload?.BaseERR) return [];
  return payload.BaseERR.map(room => {
    const geolocation = String(room.geolocation || "")
      .split(',')
      .map(coord => parseFloat(coord.trim()));

    if (geolocation.length === 2 && !isNaN(geolocation[0]) && !isNaN(geolocation[1])) {
      return {
        name: room.baseerr,
        geolocation,
        activeRooms: Number(room.rooms || 0),
        district: room.district,
        controlledBy: room.controlledby,
        kitchens: Number(room.kitchens || 0),
        pots: Number(room.pots || 0),
        clinic: Number(room.clinics || 0),
        childrenCenter: Number(room.childrencenters || 0),
        womenCoop: Number(room.womencoops || 0),
        womenBreak: Number(room.womenrestrooms || 0),
        population: Number(room.ServedPopulation || 0),
        arabicName: room.ArabicName,
        description: room.Discription,
        photo: room.Photos || room.photos || room.photo
      };
    }
    console.error("Invalid GPSLocation data for room:", room?.baseerr);
    return null;
  }).filter(Boolean);
}
