import React from 'react'
import { motion } from 'framer-motion'
import { Target, Shield, X } from 'lucide-react'
import { externalResources, disclaimer, safetyGuidelines } from '../utils/externalResources'

const HowToGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 border border-purple-400/20 rounded-lg p-6 max-w-6xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Complete Position How-To Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Power Exchange Positions */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">👑</span>
              Power Exchange Positions
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">👑 Dominant Position</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Establish clear boundaries and safe words</li>
                      <li>• Create a comfortable, private environment</li>
                      <li>• Have emergency contacts readily available</li>
                      <li>• Discuss limits and expectations beforehand</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Start with gentle commands and build up</li>
                      <li>• Maintain confident, clear communication</li>
                      <li>• Check in regularly with your partner</li>
                      <li>• Be prepared to adapt and adjust</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Always respect safe words immediately</li>
                      <li>• Monitor partner's physical and emotional state</li>
                      <li>• Have an exit strategy planned</li>
                      <li>• Never push beyond established limits</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🙇‍♀️ Submissive Position</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Choose your Dominant carefully and trust them</li>
                      <li>• Establish clear safe words and signals</li>
                      <li>• Set up a support system for aftercare</li>
                      <li>• Prepare mentally for surrender</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Follow commands while staying aware</li>
                      <li>• Communicate your needs and limits clearly</li>
                      <li>• Use safe words when needed</li>
                      <li>• Trust your instincts</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Never submit to someone you don't trust</li>
                      <li>• Keep safe words accessible and clear</li>
                      <li>• Stay aware of your physical limits</li>
                      <li>• Have a support system in place</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Positions */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🧘</span>
              Physical Positions
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">⬆️ Missionary Position</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner lies on their back</li>
                      <li>• Spread legs comfortably apart</li>
                      <li>• Use pillows to adjust angle and depth</li>
                      <li>• Ensure comfortable positioning</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner positions on top</li>
                      <li>• Maintain eye contact for intimacy</li>
                      <li>• Control the pace for maximum pleasure</li>
                      <li>• Use hands to caress and stimulate</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Adjust pillow placement for optimal angle</li>
                      <li>• Communicate about depth and pace</li>
                      <li>• Maintain emotional connection</li>
                      <li>• Take breaks if needed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🐕 Doggy Style</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner on hands and knees</li>
                      <li>• Adjust height with pillows or furniture</li>
                      <li>• Ensure stable positioning</li>
                      <li>• Choose comfortable surface</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner enters from behind</li>
                      <li>• Use hands to guide and control</li>
                      <li>• Vary the angle for different sensations</li>
                      <li>• Communicate about depth and speed</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Arch back for deeper penetration</li>
                      <li>• Use furniture for support and leverage</li>
                      <li>• Control intensity carefully</li>
                      <li>• Watch for signs of discomfort</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🦴 Prone Bone</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner lies flat on stomach</li>
                      <li>• Use pillows to adjust the angle</li>
                      <li>• Ensure comfortable positioning</li>
                      <li>• Prepare for deep penetration</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner positions on top</li>
                      <li>• Control the depth and pace carefully</li>
                      <li>• Use hands to caress and stimulate</li>
                      <li>• Communicate about comfort and pleasure</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Start slowly and build up intensity</li>
                      <li>• Monitor partner's comfort level</li>
                      <li>• Use pillows for optimal positioning</li>
                      <li>• Communicate clearly about limits</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🛏️ Edge of Bed</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner lies on bed edge</li>
                      <li>• Spread legs comfortably</li>
                      <li>• Adjust bed height for optimal positioning</li>
                      <li>• Use pillows for comfort and angle</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner stands and enters</li>
                      <li>• Control the pace and depth</li>
                      <li>• Use hands to stimulate and guide</li>
                      <li>• Maintain balance and stability</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Ensure bed is stable and secure</li>
                      <li>• Adjust positioning for maximum pleasure</li>
                      <li>• Control intensity carefully</li>
                      <li>• Communicate about positioning comfort</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🧱 Against Wall</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner stands against wall</li>
                      <li>• Choose a stable, clean wall surface</li>
                      <li>• Ensure good balance and support</li>
                      <li>• Prepare for standing penetration</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner enters from front</li>
                      <li>• Use hands for balance and control</li>
                      <li>• Adjust angle for maximum pleasure</li>
                      <li>• Communicate about positioning comfort</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Use wall for support and leverage</li>
                      <li>• Control the intensity carefully</li>
                      <li>• Watch for balance and comfort</li>
                      <li>• Have a safe way to end position</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🪑 Chair Position</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner sits on stable chair</li>
                      <li>• Choose a chair with good support</li>
                      <li>• Ensure comfortable positioning</li>
                      <li>• Prepare for intimate connection</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner sits on lap</li>
                      <li>• Face partner or face away</li>
                      <li>• Use hands to guide and stimulate</li>
                      <li>• Communicate about positioning and pleasure</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Ensure chair is stable and secure</li>
                      <li>• Adjust positioning for comfort</li>
                      <li>• Control the intensity carefully</li>
                      <li>• Use hands for balance and stimulation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🥄 Spooning</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Both partners lie on their sides</li>
                      <li>• Penetrating partner behind receiving partner</li>
                      <li>• Use pillows for comfort and positioning</li>
                      <li>• Ensure comfortable alignment</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Gentle penetration from behind</li>
                      <li>• Adjust angle for optimal penetration</li>
                      <li>• Use hands to caress and stimulate</li>
                      <li>• Communicate about comfort and pleasure</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Perfect for intimate, gentle connection</li>
                      <li>• Use pillows to adjust height and angle</li>
                      <li>• Control the intensity carefully</li>
                      <li>• Great for cuddling and intimacy</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🤠 Cowgirl</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner lies on their back</li>
                      <li>• Receiving partner positions on top</li>
                      <li>• Ensure comfortable positioning</li>
                      <li>• Prepare for receiving partner control</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner controls pace and depth</li>
                      <li>• Start slowly and build up intensity</li>
                      <li>• Use hands to stimulate partner</li>
                      <li>• Communicate about positioning and pleasure</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner has full control</li>
                      <li>• Use hands for balance and stimulation</li>
                      <li>• Control the intensity carefully</li>
                      <li>• Great for partner empowerment</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🦋 Butterfly</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner lies on their back</li>
                      <li>• Raise and spread legs wide</li>
                      <li>• Use pillows to support the legs</li>
                      <li>• Prepare for deep access</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner positions between legs</li>
                      <li>• Control the depth and pace carefully</li>
                      <li>• Use hands to stimulate and guide</li>
                      <li>• Communicate about comfort and pleasure</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Tips:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Excellent for deep penetration</li>
                      <li>• Use pillows for leg support</li>
                      <li>• Control the depth carefully</li>
                      <li>• Great for vulnerability and exposure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intense Positions */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💥</span>
              Intense Penetration Positions
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🐕 Deep Doggy</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner arches back for maximum depth</li>
                      <li>• Use pillows to adjust height and angle</li>
                      <li>• Ensure stable positioning</li>
                      <li>• Prepare for intense penetration</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner uses full strength</li>
                      <li>• Powerful, deep thrusting</li>
                      <li>• Build up intensity gradually</li>
                      <li>• Communicate about depth and pace</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Ensure both partners are comfortable with intensity</li>
                      <li>• Have clear safe words established</li>
                      <li>• Watch for signs of discomfort</li>
                      <li>• Control the depth carefully</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">💪 Carry Pound</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner must have sufficient strength</li>
                      <li>• Use walls or furniture for support</li>
                      <li>• Ensure safe way to lower partner</li>
                      <li>• Prepare for maximum intensity</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Hold receiving partner up while standing</li>
                      <li>• Deliver intense, deep thrusting</li>
                      <li>• Use support for balance</li>
                      <li>• Communicate about comfort and safety</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Only attempt if both partners are comfortable</li>
                      <li>• Have a safe way to end the position</li>
                      <li>• Watch for signs of fatigue</li>
                      <li>• Communicate clearly about safety</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🦴 Prone Deep</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner lies completely flat</li>
                      <li>• Use pillows to adjust the angle</li>
                      <li>• Ensure comfortable positioning</li>
                      <li>• Prepare for maximum depth</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner positions on top</li>
                      <li>• Maximum depth and control</li>
                      <li>• Intense pounding motion</li>
                      <li>• Communicate about comfort and pleasure</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Ensure comfortable positioning</li>
                      <li>• Watch for signs of discomfort</li>
                      <li>• Control the depth carefully</li>
                      <li>• Have clear communication about limits</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">🛏️ Edge Pound</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner at bed edge</li>
                      <li>• Adjust bed height for optimal positioning</li>
                      <li>• Use pillows for comfort and angle</li>
                      <li>• Prepare for hard thrusting</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Penetrating partner stands and delivers</li>
                      <li>• Intense, hard thrusting</li>
                      <li>• Maximum force and control</li>
                      <li>• Use hands to stimulate and guide</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Ensure the bed is stable</li>
                      <li>• Watch for signs of discomfort</li>
                      <li>• Control the intensity</li>
                      <li>• Have clear communication about positioning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bondage Positions */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🪢</span>
              Bondage Positions
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">✋ Spread Eagle</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner lies on back</li>
                      <li>• Tie wrists and ankles to bed posts</li>
                      <li>• Ensure comfortable rope tension</li>
                      <li>• Have safety scissors nearby</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Complete vulnerability and exposure</li>
                      <li>• Full access for penetration</li>
                      <li>• Control pace and intensity</li>
                      <li>• Monitor partner's comfort</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Always have safety scissors accessible</li>
                      <li>• Check circulation regularly</li>
                      <li>• Monitor partner's breathing</li>
                      <li>• Establish clear safe words</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-3">📦 Box Tie</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Setup:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Receiving partner sits or stands</li>
                      <li>• Tie arms behind back securely</li>
                      <li>• Ensure comfortable positioning</li>
                      <li>• Have safety release mechanism</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Execution:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Arms restrained behind back</li>
                      <li>• Vulnerable and exposed position</li>
                      <li>• Full control for penetrating partner</li>
                      <li>• Monitor comfort and safety</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-purple-300 mb-1">Safety:</h6>
                    <ul className="text-purple-200 space-y-1">
                      <li>• Check arm circulation frequently</li>
                      <li>• Have quick release mechanism</li>
                      <li>• Monitor shoulder comfort</li>
                      <li>• Establish clear communication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* General Safety Guidelines */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h4 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Essential Safety Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-lg font-semibold text-red-200 mb-3">Before Any Position:</h5>
                <ul className="text-red-100 space-y-2 text-sm">
                  {safetyGuidelines.beforeAnyPosition.map((guideline, index) => (
                    <li key={index}>• {guideline}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-red-200 mb-3">During Play:</h5>
                <ul className="text-red-100 space-y-2 text-sm">
                  {safetyGuidelines.duringPlay.map((guideline, index) => (
                    <li key={index}>• {guideline}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* External Resources Section */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h4 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              External Learning Resources
            </h4>
            
            <div className="space-y-6">
              {/* Visual Guides */}
              <div>
                <h5 className="text-lg font-semibold text-blue-200 mb-3">📸 Visual Position Guides</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Anatomical Diagrams</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.visualGuides.anatomicalDiagrams.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">BDSM-Specific Visuals</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.visualGuides.bdsmSpecific.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Video Tutorials */}
              <div>
                <h5 className="text-lg font-semibold text-blue-200 mb-3">🎥 Video Tutorials</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Educational Platforms</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.videoTutorials.educationalPlatforms.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Professional Content</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.videoTutorials.professionalContent.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Written Guides */}
              <div>
                <h5 className="text-lg font-semibold text-blue-200 mb-3">📚 Comprehensive Written Guides</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">BDSM Education</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.writtenGuides.bdsmEducation.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Safety & Technique</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.writtenGuides.safetyAndTechnique.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Position-Specific Resources */}
              <div>
                <h5 className="text-lg font-semibold text-blue-200 mb-3">🎯 Position-Specific Resources</h5>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Power Exchange</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.positionSpecific.powerExchange.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Bondage & Rope</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.positionSpecific.bondageAndRope.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Impact Play</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.positionSpecific.impactPlay.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Community & Events */}
              <div>
                <h5 className="text-lg font-semibold text-blue-200 mb-3">🤝 Community & Events</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Online Communities</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.communityAndEvents.onlineCommunities.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Events & Workshops</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.communityAndEvents.eventsAndWorkshops.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Safety & Legal */}
              <div>
                <h5 className="text-lg font-semibold text-blue-200 mb-3">🛡️ Safety & Legal Resources</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Safety Organizations</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.safetyAndLegal.safetyOrganizations.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h6 className="font-medium text-blue-300 mb-2">Medical & Health</h6>
                    <ul className="text-blue-100 space-y-1 text-sm">
                      {externalResources.safetyAndLegal.medicalAndHealth.map((resource, index) => (
                        <li key={index}>
                          • <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">{resource.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h6 className="font-medium text-yellow-300 mb-2">{disclaimer.title}</h6>
                <p className="text-yellow-100 text-sm">{disclaimer.content}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default HowToGuideModal
