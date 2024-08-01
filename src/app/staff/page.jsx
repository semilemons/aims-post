"use client"

import React, { useState, useRef } from 'react';
import { Printer, Package, Settings, LogOut, Images, PrinterIcon, Send, Upload, Check, FastForward, QrCode, MessageCircle, Info } from 'lucide-react';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('発送代行業務');
  const [selectedJob, setSelectedJob] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isQrCodeConfirmed, setIsQrCodeConfirmed] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [printJobs, setPrintJobs] = useState([
    { id: '001', client: '山田太郎', productName: 'フォトブック', registrationDate: '2024-08-01', status: '未処理', imageCount: 20, qrCode: null },
    { id: '002', client: '鈴木花子', productName: 'ポストカードセット', registrationDate: '2024-08-02', status: '未処理', imageCount: 10, qrCode: null },
    { id: '003', client: '佐藤次郎', productName: 'カレンダー', registrationDate: '2024-08-03', status: '未処理', imageCount: 12, qrCode: null },
  ].sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate)));
  const fileInputRef = useRef(null);

  const tabs = [
    { name: '発送代行業務', icon: Printer },
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
    if (workflowStep < 4) {
      setWorkflowStep(workflowStep + 1);
      if (workflowStep === 3) {
        updateJobStatus(selectedJob.id, 'QRコード作成済み');
      }
    } else {
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
      updateJobStatus(selectedJob.id, '代行者様への報告完了');
      setPrintJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === selectedJob.id ? { ...job, status: '代行者様への報告完了', qrCode: qrCodeImage } : job
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

  const handleShowDetails = (job) => {
    setSelectedJobDetails(job);
    setShowDetailsModal(true);
  };

  const renderWorkflowInstructions = () => {
    if (!selectedJob) return null;

    const steps = [
      { step: 1, instruction: `代行者様の${selectedJob.imageCount}枚の画像をチェックします。`, icon: <Images className="w-6 h-6" /> },
      { step: 2, instruction: `タイトルは${selectedJob.productName}です。発送作業を行ってください。`, icon: <PrinterIcon className="w-6 h-6" /> },
      { step: 3, instruction: "QRコードの画像をアップロードしてください。（今後QRコード読み取り機能を追加！！）", icon: <Upload className="w-6 h-6" /> },
      { step: 4, instruction: "代行者様に報告してください。", icon: <MessageCircle className="w-6 h-6" /> },
    ];

    const currentStep = steps[workflowStep - 1];

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-lg mb-2">作業手順 - ステップ {currentStep.step}</h4>
        <div className="flex items-center">
          {currentStep.icon}
          <p className="ml-2">{currentStep.instruction}</p>
        </div>
        {workflowStep === 1 && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {[...Array(selectedJob.imageCount)].map((_, index) => (
              <img key={index} src={`/api/placeholder/100/100?text=Image${index + 1}`} alt={`Dummy Image ${index + 1}`} className="w-20 h-20 object-cover" />
            ))}
          </div>
        )}
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
        {workflowStep === 4 && (
          <div className="mt-4">
            <p>代行者様 {selectedJob.client} に報告してください。</p>
          </div>
        )}
        <button
          onClick={handleNextStep}
          className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            (workflowStep === 3 && (!qrCodeImage || !isQrCodeConfirmed)) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={workflowStep === 3 && (!qrCodeImage || !isQrCodeConfirmed)}
        >
          {workflowStep === 4 ? "報告完了" : "次のステップへ"}
        </button>
      </div>
    );
  };

  const DetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-3/4 max-h-3/4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">発送情報詳細</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>代行者（お客様）:</strong> {job.client}</p>
              <p><strong>商品名:</strong> {job.productName}</p>
              <p><strong>登録日:</strong> {job.registrationDate}</p>
              <p><strong>ステータス:</strong> {job.status}</p>
              <p><strong>画像枚数:</strong> {job.imageCount}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">アップロード画像</h3>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(job.imageCount)].map((_, index) => (
                  <img key={index} src={`/api/placeholder/100/100?text=Image${index + 1}`} alt={`Dummy Image ${index + 1}`} className="w-24 h-24 object-cover" />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            閉じる
          </button>
        </div>
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
            <h3 className="text-lg font-semibold mb-4">発送代行業務一覧</h3>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">登録日</th>
                  <th className="px-4 py-2 text-left">代行者（お客様）</th>
                  <th className="px-4 py-2 text-left">商品名</th>
                  <th className="px-4 py-2 text-left">ステータス</th>
                  <th className="px-4 py-2 text-left">アクション</th>
                  <th className="px-4 py-2 text-left">内容詳細</th>
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
                      {job.status === '代行者様への報告完了' && (
                        <button
                          className="bg-purple-200 text-purple-700 px-3 py-1 rounded opacity-50 cursor-not-allowed"
                          disabled
                        >
                          作業終了
                        </button>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleShowDetails(job)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderWorkflowInstructions()}
          </div>
        </main>
      </div>
      {showDetailsModal && (
        <DetailsModal
          job={selectedJobDetails}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default StaffDashboard;