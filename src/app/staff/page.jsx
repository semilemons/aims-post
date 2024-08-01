"use client"

import React, { useState, useRef } from 'react';
import { Printer, Package, Settings, LogOut, Images, PrinterIcon, Send, Upload, Check, FastForward, QrCode } from 'lucide-react';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('印刷代行業務');
  const [selectedJob, setSelectedJob] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isQrCodeConfirmed, setIsQrCodeConfirmed] = useState(false);
  const [printJobs, setPrintJobs] = useState([
    { id: '001', client: '山田太郎', productName: 'フォトブック', registrationDate: '2024-08-01', status: '未処理', imageCount: 20, qrCode: null },
    { id: '002', client: '鈴木花子', productName: 'ポストカードセット', registrationDate: '2024-08-02', status: '未処理', imageCount: 10, qrCode: null },
    { id: '003', client: '佐藤次郎', productName: 'カレンダー', registrationDate: '2024-08-03', status: '未処理', imageCount: 12, qrCode: null },
  ].sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate)));
  const fileInputRef = useRef(null);

  const tabs = [
    { name: '印刷代行業務', icon: Printer },
    { name: '発送管理', icon: Package },
    { name: '設定', icon: Settings },
  ];

  const handleStartProcess = (job) => {
    setSelectedJob(job);
    setWorkflowStep(1);
    setQrCodeImage(null);
    setIsQrCodeConfirmed(false);
    updateJobStatus(job.id, '処理中');
  };

  const handleNextStep = () => {
    if (workflowStep < 3) {
      setWorkflowStep(workflowStep + 1);
    } else if (isQrCodeConfirmed || qrCodeImage) {
      completeJob();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setQrCodeImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const updateJobStatus = (jobId, newStatus) => {
    setPrintJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const completeJob = () => {
    if (selectedJob) {
      updateJobStatus(selectedJob.id, '完了');
      setPrintJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === selectedJob.id ? { ...job, status: '完了', qrCode: qrCodeImage } : job
        )
      );
    }
    setSelectedJob(null);
    setWorkflowStep(0);
    setQrCodeImage(null);
    setIsQrCodeConfirmed(false);
  };

  const handleTestSkip = () => {
    setQrCodeImage('dummy');
    setIsQrCodeConfirmed(true);
  };

  const renderWorkflowInstructions = () => {
    if (!selectedJob) return null;

    const steps = [
      { step: 1, instruction: `${selectedJob.imageCount}枚の画像を取り出してください。`, icon: <Images className="w-6 h-6" /> },
      { step: 2, instruction: `${selectedJob.productName}の印刷を行ってください。`, icon: <PrinterIcon className="w-6 h-6" /> },
      { step: 3, instruction: "QRコードをアップロードし、発送手続きを行ってください。", icon: <Send className="w-6 h-6" /> },
    ];

    const currentStep = steps[workflowStep - 1];

    return (
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h4 className="font-semibold text-lg mb-2">作業手順 - ステップ {currentStep.step}</h4>
        <div className="flex items-center">
          {currentStep.icon}
          <p className="ml-2">{currentStep.instruction}</p>
        </div>
        {workflowStep === 3 && (
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center">
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center mr-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                QRコードをアップロード
              </button>
              {/* TODO: テストが完了したら以下のボタンを削除してください */}
              <button
                onClick={handleTestSkip}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
              >
                <FastForward className="w-4 h-4 mr-2" />
                テストスキップ
              </button>
            </div>
            {qrCodeImage && (
              <div className="mt-4">
                <img src={qrCodeImage} alt="QR Code" className="w-32 h-32 object-contain" />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="qrConfirm"
                    checked={isQrCodeConfirmed}
                    onChange={(e) => setIsQrCodeConfirmed(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="qrConfirm">お客様のQRコード画像を発行しました</label>
                </div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleNextStep}
          className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            workflowStep === 3 && (!qrCodeImage || !isQrCodeConfirmed) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={workflowStep === 3 && (!qrCodeImage || !isQrCodeConfirmed)}
        >
          {workflowStep === 3 ? "作業完了" : "次のステップへ"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドバー */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">AIMS-POST-Staff</h1>
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">印刷代行業務一覧</h3>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">登録日</th>
                  <th className="px-4 py-2 text-left">代行者（お客様）</th>
                  <th className="px-4 py-2 text-left">商品名</th>
                  <th className="px-4 py-2 text-left">ステータス</th>
                  <th className="px-4 py-2 text-left">アクション</th>
                </tr>
              </thead>
              <tbody>
                {printJobs.map(job => (
                  <tr key={job.id}>
                    <td className="border px-4 py-2">{job.registrationDate}</td>
                    <td className="border px-4 py-2">{job.client}</td>
                    <td className="border px-4 py-2">{job.productName}</td>
                    <td className="border px-4 py-2">{job.status}</td>
                    <td className="border px-4 py-2">
                      {job.status === '未処理' && (
                        <button 
                          onClick={() => handleStartProcess(job)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          作業開始
                        </button>
                      )}
                      {job.status === '完了' && job.qrCode && (
                        <div className="flex items-center">
                          <QrCode className="w-6 h-6 mr-2 text-blue-500" />
                          <img src={job.qrCode} alt="Completed QR Code" className="w-10 h-10 object-contain" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderWorkflowInstructions()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;