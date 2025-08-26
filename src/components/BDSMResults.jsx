import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, TrendingUp, Heart, Zap, Info, X } from 'lucide-react'
import { getRoleDescription } from '../utils/roleDescriptions'
import { MarkdownText } from '../utils/markdownRenderer.jsx'

const BDSMResults = ({ results }) => {
  const [expandedRoles, setExpandedRoles] = useState({})
  const [hoveredRole, setHoveredRole] = useState(null)

  const toggleRoleExpansion = (resultId, role) => {
    const key = `${resultId}-${role}`
    setExpandedRoles(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  const getColorClass = (color) => {
    switch (color) {
      case 'green': return 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600'
      case 'yellow': return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600'
      case 'orange': return 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-500'
      case 'red': return 'bg-gradient-to-r from-red-400 via-red-500 to-pink-600'
      default: return 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600'
    }
  }

  const getEmoji = (role) => {
    // Clean the role name first (remove "More info" and tabs/unicode chars)
    const cleanRole = role.replace(/[\t\u00c2\u00a0]*More[\u00c2\u00a0\s]*info/gi, '').replace(/\s+/g, ' ').trim();
    
    const emojiMap = {
      'Submissive': '🙇‍♀️',
      'Dominant': '👑',
      'Switch': '🔄',
      'Voyeur': '👁️',
      'Exhibitionist': '🎭',
      'Rope bunny': '🪢',
      'Rigger': '🎪',
      'Masochist': '💔',
      'Sadist': '⚡',
      'Brat': '😈',
      'Brat tamer': '🎯',
      'Daddy/Mommy': '👨‍👩‍👧‍👦',
      'Little': '🧸',
      'Ageplayer': '🎠',
      'Pet': '🐾',
      'Owner': '🏠',
      'Master/Mistress': '⚜️',
      'Slave': '⛓️',
      'Degrader': '🗣️',
      'Degradee': '😔',
      'Primal (Hunter)': '🐺',
      'Primal (Prey)': '🦌',
      'Experimentalist': '🧪',
      'Vanilla': '🍦',
      'Non-monogamist': '💕',
      'Monogamist': '💍',
      'Boy/Girl': '👶',
      'Caregiver': '🤱'
    }
    return emojiMap[cleanRole] || '❓'
  }

  const getRoleDescription = (role, result) => {
    // First try to use scraped description from the server
    if (result && result.description) {
      return result.description;
    }
    
    // Fallback to hardcoded descriptions
    const descriptions = {
      'Submissive': '**Submissive individuals** find deep fulfillment in surrendering control to their partner, embracing a role of service and obedience. This dynamic involves following orders, accepting guidance, and finding pleasure in being directed rather than directing. Submissives often experience intense satisfaction from giving up power, being cared for, and serving their dominant partner\'s needs. The role encompasses various levels of submission, from light service-oriented activities to complete surrender, and can include protocols, rituals, and structured dynamics that provide comfort and security through clear expectations and boundaries.',
      
      'Dominant': '**Dominant individuals** thrive on taking control and leading their partner through scenes and dynamics. This role involves making decisions, giving orders, and directing activities while ensuring the safety and well-being of their submissive partner. Dominants find satisfaction in being in charge, providing structure, and guiding their partner\'s experiences. The role requires responsibility, clear communication, and the ability to read their partner\'s responses and adjust accordingly. Dominance can manifest in various ways, from gentle guidance to strict control, and often includes elements of protection, teaching, and nurturing within the power dynamic.',
      
      'Switch': '**Switch individuals** possess the unique ability to enjoy both dominant and submissive roles, adapting their energy and approach based on the situation, partner, or their own needs. This flexibility allows them to experience the full spectrum of BDSM dynamics and provides opportunities for deeper understanding of both sides of power exchange. Switches can alternate between roles within the same relationship, with different partners, or based on their current emotional state. This adaptability often leads to more balanced relationships and enhanced communication skills, as they can empathize with both dominant and submissive perspectives.',
      
      'Voyeur': '**Voyeuristic individuals** derive intense arousal and satisfaction from watching others engage in sexual activities or intimate moments. This can involve observing partners, other couples, or performances in safe, consensual environments. Voyeurs often have highly developed visual imaginations and find pleasure in the anticipation and observation aspects of sexuality. The role can include watching live performances, viewing recorded content, or observing through windows or other means in appropriate settings. Voyeurism is about the thrill of watching and the mental stimulation that comes from observing intimate moments.',
      
      'Exhibitionist': '**Exhibitionist individuals** find deep pleasure in being watched during sexual activities or intimate moments. This can involve performing for partners, other couples, or audiences in safe, consensual environments. Exhibitionists often enjoy the attention, validation, and thrill that comes from being observed. The role can include performing live, creating content for viewing, or engaging in activities in semi-public spaces where they might be seen. Exhibitionism is about the excitement of being the center of attention and the validation that comes from being desired and observed.',
      
      'Rope bunny': '**Rope bunnies** find intense pleasure and satisfaction in being tied up, restrained, or bound by their partner. This role involves enjoying the physical sensations of rope, the helplessness of being restrained, and the trust required to surrender control to their rigger. Rope bunnies often experience deep relaxation, meditation-like states, or intense arousal from the combination of physical restraint and mental surrender. The role can include various types of bondage, from simple wrist ties to complex full-body harnesses, and often involves elements of sensory deprivation and vulnerability.',
      
      'Rigger': '**Riggers** are skilled practitioners who enjoy creating intricate bondage patterns and controlling their partner through restraint. This role involves learning various tying techniques, understanding safety protocols, and developing the ability to read their partner\'s responses to different types of bondage. Riggers find satisfaction in the artistic and technical aspects of rope work, as well as the power dynamic created through physical restraint. The role requires ongoing education, practice, and a deep understanding of anatomy and safety to ensure their partner\'s well-being while creating beautiful and functional bondage.',
      
      'Masochist': '**Masochistic individuals** find pleasure and arousal in receiving pain or discomfort in a sexual context. This can involve various types of impact play, sensation play, or other forms of controlled discomfort. Masochists often experience endorphin rushes, altered states of consciousness, or intense emotional release through pain. The role requires clear communication about limits, pain tolerance, and the types of sensations that are pleasurable. Masochism is about finding pleasure in controlled, consensual pain rather than actual harm, and often involves elements of trust, surrender, and emotional catharsis.',
      
      'Sadist': '**Sadistic individuals** find pleasure and arousal in giving pain or discomfort to their partner in a sexual context. This role involves understanding various implements, techniques, and safety protocols to ensure their partner\'s well-being while providing the desired sensations. Sadists often enjoy the power dynamic, the technical skill involved, and the satisfaction of meeting their partner\'s needs. The role requires ongoing education, clear communication, and the ability to read their partner\'s responses to adjust intensity and technique accordingly. Sadism is about providing controlled, consensual pain rather than causing harm.',
      
      'Brat': '**Bratty individuals** are submissives who enjoy being playful, disobedient, or challenging to their dominant partner. This role involves pushing boundaries, testing limits, and provoking their partner in a consensual and playful manner. Brats often enjoy the attention, discipline, and dynamic tension that comes from their behavior. The role can include sass, backtalk, playful disobedience, or other behaviors designed to elicit a response from their dominant. Bratting is about maintaining the submissive role while adding elements of challenge and playfulness to the dynamic.',
      
      'Brat tamer': '**Brat tamers** are dominants who enjoy dealing with bratty behavior and using discipline, control, and creativity to manage playful disobedience. This role involves understanding brat psychology, developing effective responses to various types of bratting, and maintaining the power dynamic while appreciating the playful challenge. Brat tamers often enjoy the creativity required, the dynamic tension, and the satisfaction of successfully managing their brat\'s behavior. The role requires patience, creativity, and the ability to distinguish between playful bratting and actual problems.',
      
      'Daddy/Mommy': '**Daddy/Mommy dynamics** involve taking on a nurturing, caring dominant role that combines elements of authority with emotional support and guidance. This role often includes elements of age play, caregiver dynamics, or simply a nurturing approach to dominance. Daddy/Mommy figures provide structure, care, discipline, and emotional support while maintaining the power dynamic. The role can involve setting rules, providing guidance, offering comfort, and creating a safe, structured environment for their partner to thrive within.',
      
      'Little': '**Little individuals** enjoy age regression, being cared for, and taking on a younger persona in scenes or dynamics. This role involves embracing childlike qualities, seeking care and guidance, and finding comfort in being nurtured by their caregiver. Littles often enjoy activities, toys, and experiences associated with younger ages, and find deep emotional satisfaction in the care and attention they receive. The role can include various levels of regression, from light playfulness to deeper age play, and often involves elements of innocence, vulnerability, and trust.',
      
      'Ageplayer': '**Age players** enjoy role-playing different ages, often involving age regression, age progression, or exploring different life stages. This role can involve taking on younger or older personas, exploring different developmental stages, or experiencing different types of relationships and dynamics. Age play can be purely role-play or involve deeper psychological elements, and often includes costumes, props, and activities appropriate to the chosen age. The role allows for exploration of different perspectives, experiences, and relationship dynamics.',
      
      'Pet': '**Pet play** involves taking on animal characteristics, behaviors, and mindsets in a BDSM context. This role can include various types of animals, from puppies and kittens to more exotic creatures, and often involves elements of training, care, and animal-like behavior. Pets often enjoy the simplicity, care, and structure that comes with their role, as well as the attention and affection from their owner. The role can include collars, leashes, training, and various animal-like activities and behaviors.',
      
      'Owner': '**Pet owners** take responsibility for their pet partner, providing care, training, guidance, and structure within the pet play dynamic. This role involves understanding their pet\'s needs, providing appropriate care and discipline, and creating a structured environment where their pet can thrive. Owners often enjoy the responsibility, the bond with their pet, and the satisfaction of providing care and guidance. The role requires patience, understanding, and the ability to balance care with appropriate discipline and training.',
      
      'Master/Mistress': '**Master/Mistress dynamics** involve a more formal, structured approach to dominance that often includes strict protocols, training programs, and long-term power exchange relationships. This role emphasizes discipline, education, and the development of the submissive partner through structured training and clear expectations. Masters/Mistresses often enjoy the formal nature of the relationship, the opportunity to guide their partner\'s development, and the satisfaction of creating a well-trained, obedient submissive. The role requires dedication, clear communication, and a commitment to ongoing education and development.',
      
      'Slave': '**Slave dynamics** involve a more intense, complete form of submission that often includes strict protocols, complete surrender, and serving their master/mistress in various ways. This role can involve domestic service, sexual service, or other forms of complete submission and obedience. Slaves often find deep satisfaction in their role, the structure it provides, and the opportunity to serve and please their master/mistress. The role requires complete trust, dedication, and a commitment to the dynamic and protocols established by their master/mistress.',
      
      'Degrader': '**Degraders** enjoy verbally or emotionally degrading their partner, using humiliation, verbal control, and psychological elements to create intense power dynamics. This role involves understanding their partner\'s limits, using appropriate language and techniques, and creating consensual humiliation that enhances rather than harms the relationship. Degraders often enjoy the psychological control, the intensity of the dynamic, and the satisfaction of pushing their partner\'s boundaries in a safe, consensual way. The role requires clear communication, understanding of limits, and the ability to distinguish between consensual degradation and actual harm.',
      
      'Degradee': '**Degradees** find pleasure in being verbally or emotionally degraded, experiencing humiliation and verbal submission in a consensual context. This role involves embracing vulnerability, accepting verbal control, and finding arousal or satisfaction in being humiliated by their partner. Degradees often experience intense emotional responses, altered states of consciousness, or deep psychological release through consensual degradation. The role requires clear communication about limits, trust in their partner, and the ability to distinguish between consensual play and actual harm.',
      
      'Primal (Hunter)': '**Primal hunters** embrace their predatory instincts, enjoying the chase, capture, and claiming of their prey. This role involves animalistic behavior, physical intensity, and the satisfaction of pursuing and taking what they want. Hunters often enjoy the physicality, the intensity, and the raw, unfiltered nature of primal play. The role can include chasing, wrestling, biting, scratching, and other animalistic behaviors, often with a focus on physical dominance and claiming their partner.',
      
      'Primal (Prey)': '**Primal prey** enjoy being chased, caught, and "hunted" by their partner, embracing their vulnerability and the thrill of the chase. This role involves running, hiding, fighting back, and ultimately being captured and claimed by their hunter. Prey often enjoy the physical intensity, the adrenaline rush, and the satisfaction of being pursued and claimed. The role can include various forms of resistance, escape attempts, and ultimately surrender to their hunter\'s dominance.',
      
      'Experimentalist': '**Experimentalists** thrive on trying new things, exploring different kinks, and being open to new experiences and sensations. This role involves curiosity, adaptability, and a willingness to step outside comfort zones to discover new sources of pleasure and satisfaction. Experimentalists often enjoy the discovery process, the variety of experiences, and the opportunity to learn and grow through exploration. The role requires open communication, clear boundaries, and a commitment to ongoing learning and discovery.',
      
      'Vanilla': '**Vanilla individuals** prefer traditional, non-kinky sexual activities and conventional romantic experiences. This role involves enjoying standard sexual practices, romantic relationships, and traditional forms of intimacy without the elements of BDSM or kink. Vanilla individuals often find satisfaction in the simplicity, familiarity, and emotional connection of traditional relationships. The role emphasizes emotional intimacy, romantic connection, and conventional forms of sexual expression.',
      
      'Non-monogamist': '**Non-monogamous individuals** enjoy having multiple partners or open relationships, finding fulfillment in polyamory, ethical non-monogamy, or other forms of consensual multiple partnerships. This role involves managing multiple relationships, clear communication about boundaries and expectations, and finding satisfaction in the variety and complexity of multiple connections. Non-monogamists often enjoy the freedom, variety, and depth of multiple relationships, as well as the personal growth that comes from managing complex relationship dynamics.',
      
      'Monogamist': '**Monogamous individuals** prefer exclusive, committed relationships with one partner, valuing deep emotional and physical connection within a dedicated partnership. This role involves building deep intimacy, maintaining long-term commitment, and finding satisfaction in the exclusivity and depth of a single relationship. Monogamists often enjoy the security, depth, and focus that comes from dedicating themselves to one partner and building a life together.',
      
      'Boy/Girl': '**Boy/Girl dynamics** involve age play where individuals take on younger personas, often involving being cared for, guided, and nurtured by their partner. This role can include various levels of regression, from light playfulness to deeper age play, and often involves elements of innocence, vulnerability, and trust. Boy/Girl play allows for exploration of different developmental stages, relationship dynamics, and forms of care and guidance.',
      
      'Caregiver': '**Caregivers** take on a nurturing, protective role, often involving caring for and guiding their partner in various ways. This role can include emotional support, practical care, guidance, and creating a safe, structured environment for their partner to thrive. Caregivers often enjoy the responsibility, the bond with their partner, and the satisfaction of providing care and support. The role requires patience, understanding, and a commitment to their partner\'s well-being and growth.'
    }
    return descriptions[role] || 'A BDSM role or kink preference that involves specific dynamics and activities.'
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {result.selectedEmoji || '♞'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {result.selectedEmoji || '♞'} {result.testName || `Test ${index + 1}`}
              </h3>
              <p className="text-purple-200 text-sm">
                {result.error ? 'Error loading results' : `${result.results.length} roles analyzed`}
              </p>
              {result.dataSource && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    result.dataSource === 'real' 
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  }`}>
                    {result.dataSource === 'real' ? '🔗 REAL DATA (Puppeteer)' : '💾 DATABASE DATA'}
                  </span>
                  {result.message && (
                    <span className="text-xs text-orange-300 opacity-80">
                      {result.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {result.error ? (
            <div className="text-red-300 p-4 bg-red-500/20 rounded-lg">
              {result.error}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Color Legend with Tooltips */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-purple-400/20">
                <h5 className="text-white font-semibold mb-2 text-center text-sm">Percentage Color Guide</h5>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">90%+</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Excellent
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">60-89%</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Good
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">40-59%</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Moderate
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-pink-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">0-39%</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Low
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-purple-300 w-5 h-5" />
                <h4 className="text-lg font-semibold text-white">All Results ({result.results.length} roles)</h4>
              </div>
              
              {result.results.map((item, itemIndex) => {
                const isExpanded = expandedRoles[`${result.id}-${item.role}`]
                const roleKey = `${result.id}-${item.role}`
                const isHovered = hoveredRole === roleKey
                
                return (
                  <div key={item.role} className="space-y-2 relative">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredRole(roleKey)}
                      onMouseLeave={() => setHoveredRole(null)}
                      onClick={() => toggleRoleExpansion(result.id, item.role)}
                    >
                      <span className="text-2xl">{getEmoji(item.role)}</span>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">
                            {item.role.replace(/[\t\u00c2\u00a0]*More[\u00c2\u00a0\s]*info.*$/gi, '').trim()}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-200 font-bold">{item.percentage}%</span>
                            <div className="p-1 text-purple-300 transition-colors">
                              {isExpanded ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: itemIndex * 0.1 }}
                            className={`h-2 rounded-full ${getColorClass(item.color)} relative`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                    
               {/* Hover Tooltip */}
               <AnimatePresence>
                 {isHovered && !isExpanded && (
                   <motion.div
                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="absolute z-10 top-full left-0 mt-2 p-4 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl max-w-sm"
                   >
                     <p className="text-purple-100 text-sm leading-relaxed break-words">
                       <MarkdownText>{getRoleDescription(item.role, item)}</MarkdownText>
                     </p>
                     <div className="text-xs text-purple-300 mt-2 opacity-80">
                       Click to expand
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
                    
                    {/* Expandable Description */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg"
                        >
                          <p className="text-purple-200 text-sm leading-relaxed">
                            <MarkdownText>{getRoleDescription(item.role, item)}</MarkdownText>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default BDSMResults
