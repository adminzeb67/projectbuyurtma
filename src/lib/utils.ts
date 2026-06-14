import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Xo'jayli tumani uchun masofa hisoblash (Haversine formati)
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Yer radiusi (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; // km
  return distance;
}

export function estimateTime(distanceKm: number) {
  // O'rtacha kuryer tezligi: 20 km/soat -> 1 km uchun 3 daqiqa
  // Baza vaqt: ovqat tayyorlash va kuryerga berish = 15 daqiqa
  const baseTime = 15;
  const deliveryTime = Math.ceil(distanceKm * 3);
  return baseTime + deliveryTime;
}
