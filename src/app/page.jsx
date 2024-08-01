"use client"

import React from 'react';
import { useState } from 'react';
import { Image, Package, Settings, LogOut, QrCode, Upload } from 'lucide-react';



const DashboardLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('ホーム');

  const tabs = [
    { name: 'ホーム', icon: Image },
    { name: '発送管理', icon: Package },
    { name: '設定', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドバー */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">AIMS-POST</h1>
        </div>
        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center w-full px-4 py-2 text-left ${
                activeTab === tab.name ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <LogOut className="w-5 h-5 mr-2" />
            ログアウト
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <h2 className="text-xl font-semibold text-gray-800">{activeTab}</h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log(`アップロード: ${selectedFile.name}`);
      setSelectedFile(null);
    } else {
      alert('ファイルを選択してください。');
    }
  };

  const handleQRCodeCheck = (id) => {
    console.log(`QRコードを表示: 商品ID ${id}`);
  };

  // 発送状態の定義
  const shippingStatuses = {
    ZIP_SENT: 'zip送信済み',
    PREPARING: '発送準備中',
    SHIPPED: '発送手続完了',
    ARRIVED: '商品到着済'
  };

  // サンプルデータ
  const sampleProducts = [
    { id: '001', name: '商品A', status: shippingStatuses.SHIPPED, date: '2024-07-30' },
    { id: '002', name: '商品B', status: shippingStatuses.PREPARING, date: '2024-07-31' },
    { id: '003', name: '商品C', status: shippingStatuses.ARRIVED, date: '2024-08-01' },
    { id: '004', name: '商品D', status: shippingStatuses.ZIP_SENT, date: '2024-08-02' },
  ];

  // QRコードボタンが押せるかどうかを判定する関数
  const isQRCodeEnabled = (status) => {
    return status === shippingStatuses.SHIPPED || status === shippingStatuses.ARRIVED;
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">商品画像zipファイルアップロード</h3>
        <p className="text-gray-600 mb-4">商品画像をzip圧縮し、安全な環境で商品画像をアップロードしてください。</p>
        <div className="mb-4 flex items-center">
          <input 
            type="file" 
            accept=".zip" 
            className="hidden" 
            id="product-image-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="product-image-upload" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            ZIPファイルを選択
          </label>
          {selectedFile && <span className="ml-4 text-gray-600">{selectedFile.name}</span>}
        </div>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          アップロード
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">最近の商品・発送履歴</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">商品ID</th>
              <th className="px-4 py-2 text-left">商品名</th>
              <th className="px-4 py-2 text-left">トップ画像</th>
              <th className="px-4 py-2 text-left">発送日</th>
              <th className="px-4 py-2 text-left">状態</th>
              <th className="px-4 py-2 text-left">QRコード</th>
            </tr>
          </thead>
          <tbody>
            {sampleProducts.map(product => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.id}</td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">
                  <img src="/api/placeholder/50/50" alt={product.name} className="w-10 h-10 object-cover" />
                </td>
                <td className="border px-4 py-2">{product.date}</td>
                <td className="border px-4 py-2">{product.status}</td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => handleQRCodeCheck(product.id)}
                    className={`bg-purple-500 text-white px-3 py-1 rounded flex items-center justify-center
                      ${isQRCodeEnabled(product.status) 
                        ? 'hover:bg-purple-600' 
                        : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!isQRCodeEnabled(product.status)}
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    QRコード
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;