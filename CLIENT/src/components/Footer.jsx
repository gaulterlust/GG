import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Ліва колонка */}
        <div className="mb-4 md:mb-0 md:w-1/3 text-center md:text-left">
          <h2 className="text-xl font-bold">GreenGard</h2>
          <p className="text-sm mt-1">Ваш надійний садовий помічник</p>
        </div>

        {/* Центрована колонка з контактами */}
        <div className="md:w-1/3 flex justify-center space-x-6 text-sm">
          <p>Тел: +38 099 123 45 67</p>
          <p>Email: info@greengard.ua</p>
        </div>

        {/* Права колонка з соцмережами і копірайтом */}
        <div className="md:w-1/3 flex flex-col items-center md:items-end text-center md:text-right">
          <div className="flex space-x-4 mb-2">
            <a href="https://www.instagram.com/green___gard/" aria-label="Instagram" className="hover:text-green-300">Instagram</a>
            <a href="https://www.tiktok.com/@green_gard" aria-label="TikTok" className="hover:text-green-300">TikTok</a>
          </div>
          <div className="text-xs text-gray-300">
            © {new Date().getFullYear()} GreenGard. Всі права захищені.
          </div>
        </div>
      </div>
    </footer>
  );
}
