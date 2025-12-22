
import React from 'react';

export const COLORS = {
  primary: '#1E7F43', // Deep Green
  secondary: '#F4C430', // Gold
  neutral: '#F8F9FA', // Light Grey
  dark: '#212529',
  white: '#FFFFFF',
};

export const ICONS = {
  Dashboard: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  Users: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Group: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="M12 7v2"/><path d="M12 15v2"/><path d="M7 12h2"/><path d="M15 12h2"/></svg>
  ),
  Savings: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/><circle cx="13" cy="13" r="2"/></svg>
  ),
  Reports: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
  ),
  Plus: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Search: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Facebook: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  Twitter: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.2-18 11.6 7.2.1 11.2-3.6 11.3-3.6-6.6-.3-8.7-4.7-8.7-4.7 1.7.2 3.4 0 3.4 0-7.3-1.6-7.8-7-7.8-7 2.3.8 4.5.8 4.5.8-5.3-4.4-2.8-9.8-2.8-9.8 8.6 10.4 19 9.3 19 9.3 1.1-6.7 8.2-5.4 8.2-5.4z"/></svg>
  ),
  Linkedin: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
  ),
  Instagram: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  ),
  Mail: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Phone: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  MapPin: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
};

export const KENYA_GEOGRAPHY = {
  "Mombasa": {
    "Changamwe": ["Changamwe", "Port Reitz", "Kipevu", "Airport", "Miritini", "Chaani"],
    "Jomvu": ["Jomvu Kuu", "Miritini", "Mikindani"],
    "Kisauni": ["Mjambere", "Junda", "Bamburi", "Mtopanga", "Magogoni", "Shanzu", "Nyali"],
    "Likoni": ["Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani"]
  },
  "Nairobi": {
    "Westlands": ["Kitisuru", "Parklands/Highridge", "Karura", "Kangemi", "Mountain View"],
    "Dagoretti North": ["Kileleshwa", "Kawangware", "Gatonyera", "Kabiro", "Lavington"],
    "Kibra": ["Laini Saba", "Lindi", "Makina", "Woodley/Kenyatta Golf Course", "Sarang'ombe"],
    "Lang'ata": ["Karen", "Nairobi West", "Mugumo-ini", "South C", "Nyayo Highrise"]
  },
  "Nakuru": {
    "Nakuru Town West": ["Barut", "London", "Kaptembwa", "Shaabab", "Rhoda", "Kapkures"],
    "Nakuru Town East": ["Biashara", "Kivumbini", "Flamingo", "Menengai", "Nakuru East"],
    "Gilgil": ["Gilgil", "Mbaruk/Eburu", "Malewa West", "Murindat", "Elementaita"]
  },
  "Uasin Gishu": {
    "Ainabkoi": ["Kapsoya", "Kaptagat", "Ainabkoi/Olare"],
    "Kapseret": ["Simat/Kapseret", "Kipkenyo", "Ngeria", "Megun", "Langas"],
    "Kesses": ["Racecourse", "Cheptiret/Kipchamo", "Tulwet/Chuiyat", "Tarakwa"]
  },
  "Kisumu": {
    "Kisumu Central": ["Railway", "Shauri Moyo Kaloleni", "Market Milimani", "Kondele", "Nyallenda B", "Nyalenda A"],
    "Kisumu East": ["Kajulu", "Manyatta B", "Nyalenda A", "Kolwa East", "Kolwa Central"],
    "Kisumu West": ["South West Kisumu", "Central Kisumu", "Kisumu North", "West Kisumu", "North West Kisumu"]
  }
};
