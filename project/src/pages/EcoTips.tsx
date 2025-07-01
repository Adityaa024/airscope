import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, MessageCircle, Share2, Filter, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EcoTip {
  id: number;
  user: string;
  avatar: string;
  tip: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
}

const staticTips: EcoTip[] = [
  {
    id: 1,
    user: "Ravi Verma",
    avatar: "🌱",
    tip: "Used a bicycle instead of a car for my daily commute. Saved 2.3 kg of CO2 today!",
    date: "30 June",
    likes: 24,
    comments: 5,
    category: "Transport"
  },
  {
    id: 2,
    user: "Kavya Joshi",
    avatar: "🌼",
    tip: "Switched to reusable cloth bags for grocery shopping. Small change, big impact!",
    date: "29 June",
    likes: 18,
    comments: 3,
    category: "Waste"
  },
  {
    id: 3,
    user: "Anjali Sharma",
    avatar: "🌿",
    tip: "Planted a neem tree in my backyard this weekend. Trees are natural air purifiers!",
    date: "28 June",
    likes: 32,
    comments: 8,
    category: "Environment"
  },
  {
    id: 4,
    user: "Arjun Patel",
    avatar: "🌳",
    tip: "Started carpooling with colleagues. We're reducing 4 cars to 1 for our office commute!",
    date: "27 June",
    likes: 15,
    comments: 2,
    category: "Transport"
  },
  {
    id: 5,
    user: "Priya Singh",
    avatar: "🌺",
    tip: "Replaced all incandescent bulbs with LED lights. 75% less energy consumption!",
    date: "26 June",
    likes: 21,
    comments: 4,
    category: "Energy"
  },
  {
    id: 6,
    user: "Vikram Kumar",
    avatar: "🍃",
    tip: "Created a small indoor garden with air-purifying plants like snake plant and peace lily.",
    date: "25 June",
    likes: 28,
    comments: 6,
    category: "Environment"
  },
  {
    id: 7,
    user: "Meera Reddy",
    avatar: "🌸",
    tip: "Started composting kitchen waste. Turning organic waste into nutrient-rich soil!",
    date: "24 June",
    likes: 19,
    comments: 3,
    category: "Waste"
  },
  {
    id: 8,
    user: "Rohit Gupta",
    avatar: "🌾",
    tip: "Organized a community cleanup drive in our neighborhood park. 50+ volunteers joined!",
    date: "23 June",
    likes: 45,
    comments: 12,
    category: "Community"
  }
];

const categories = ["All", "Transport", "Energy", "Waste", "Environment", "Community"];

export const EcoTips: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [likedTips, setLikedTips] = useState<Set<number>>(new Set());

  const filteredTips = staticTips.filter(tip => {
    const matchesCategory = selectedCategory === "All" || tip.category === selectedCategory;
    const matchesSearch = tip.tip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (tipId: number) => {
    setLikedTips(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(tipId)) {
        newLiked.delete(tipId);
      } else {
        newLiked.add(tipId);
      }
      return newLiked;
    });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={handleBackToDashboard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Community Eco Tips
                </h1>
                <p className="text-gray-600">🌱 Demo View – Static Community Tips</p>
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tips or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white/80 backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tips Grid */}
        <div className="space-y-6">
          {filteredTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 p-6"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  {tip.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{tip.user}</h3>
                  <p className="text-sm text-gray-500">{tip.date}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  {tip.category}
                </span>
              </div>

              {/* Tip Content */}
              <p className="text-gray-700 mb-4 leading-relaxed font-medium">{tip.tip}</p>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <motion.button
                  onClick={() => handleLike(tip.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    likedTips.has(tip.id)
                      ? 'bg-red-100 text-red-600 border border-red-200'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedTips.has(tip.id) ? 'fill-current' : ''}`} />
                  <span className="font-medium">
                    {tip.likes + (likedTips.has(tip.id) ? 1 : 0)}
                  </span>
                </motion.button>

                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{tip.comments}</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200">
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tips found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Beta Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 text-center border border-white/30"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🧪</span>
            <h3 className="text-lg font-semibold text-gray-800">Beta Feature</h3>
          </div>
          <p className="text-gray-600">
            This is a preview of our Community Eco Tips feature. 
            Full functionality with user submissions and real-time updates coming soon!
          </p>
        </motion.div>
      </main>
    </div>
  );
};