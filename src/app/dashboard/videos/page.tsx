import React from 'react'
import { Play, Video } from 'lucide-react'

export default function VideosPage() {
  const videos = [
    { title: 'Introduction to IAM Roles', duration: '45:20', course: 'AWS Cloud', thumbnail: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=400&q=80' },
    { title: 'Python List Comprehensions', duration: '28:15', course: 'Python Basics', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80' },
    { title: 'OSI Model Deep Dive', duration: '55:00', course: 'Networking', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Video Lectures</h1>
        <p className="text-gray-400 text-sm">Rewatch recorded sessions and tutorials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((vid, idx) => (
          <div key={idx} className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg border border-[#002855] group cursor-pointer hover:border-[#FF6B00]/50 transition-all">
            <div className="relative h-48 w-full">
              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,107,0,0.6)] group-hover:scale-110 transition-transform">
                  <Play size={24} className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
                {vid.duration}
              </div>
            </div>
            <div className="p-5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00A3FF]">{vid.course}</span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-[#FF6B00] transition-colors">{vid.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
