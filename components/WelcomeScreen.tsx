
import React, { useState } from 'react';
import { AgeGroup, UserProfile } from '../types';
import { Fingerprint, ArrowRight, Building2, UserCircle2, Palette } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const INDUSTRIES = [
  "互联网/科技",
  "金融/资本",
  "公务员/体制内",
  "医疗/生物",
  "制造业/实业",
  "自由职业/个体",
  "在校学生/无业"
];

const AVATAR_STYLES = [
  { id: "cyberpunk", name: "赛博霓虹 (Cyberpunk)", desc: "高对比度、霓虹雨夜、未来感" },
  { id: "noir", name: "暗黑侦探 (Noir)", desc: "黑白光影、胶片颗粒、神秘感" },
  { id: "oil", name: "极乐迪斯科 (Oil)", desc: "厚重油画、表现主义、深沉" },
  { id: "anime", name: "新海诚风 (Anime)", desc: "精致光影、孤独都市、唯美" },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState<string>('');
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [avatarStyle, setAvatarStyle] = useState<string>(AVATAR_STYLES[0].id);

  const handleStart = () => {
    const ageNum = parseInt(age);
    if (!nickname || isNaN(ageNum)) return;

    let group: AgeGroup = 'child';
    if (ageNum < 13) group = 'child';
    else if (ageNum < 18) group = 'teen';
    else group = 'adult';

    onComplete({
      nickname,
      age: ageNum,
      ageGroup: group,
      industry: group === 'adult' ? industry : '学生',
      avatarStyle
    });
  };

  // Dynamically apply theme class for preview
  const themeClass = `theme-${avatarStyle}`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${themeClass}`} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Dynamic Background Preview */}
      <div className="bg-noise"></div>
      
      {/* Additional style-specific background elements */}
      {avatarStyle === 'cyberpunk' && <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none"></div>}
      {avatarStyle === 'noir' && <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#000_120%)] pointer-events-none"></div>}

      <div className="max-w-md w-full relative z-10">
        <div className={`p-8 md:p-10 shadow-2xl transition-all duration-300 ${avatarStyle === 'cyberpunk' ? 'bg-black border border-[var(--accent-color)]' : 'card-glass border border-white/10'}`}>
          
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border shadow-[0_0_15px_rgba(255,255,255,0.05)] ${avatarStyle === 'cyberpunk' ? 'bg-black border-[var(--accent-color)] text-[var(--accent-color)]' : 'bg-slate-800 border-slate-600 text-purple-400'}`}>
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-widest mb-2 font-serif glow-text">华京市风云录</h1>
            <p className="text-[var(--text-secondary)] text-sm tracking-widest uppercase border-t border-white/10 pt-4 mt-4 inline-block w-full">
              市民身份登记处
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                <UserCircle2 size={14} /> 姓名代号
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入你的代号..."
                className="w-full bg-[var(--bg-primary)] border border-white/20 rounded-md py-2.5 px-4 text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                  <Fingerprint size={14} /> 生理年龄
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className="w-full bg-[var(--bg-primary)] border border-white/20 rounded-md py-2.5 px-4 text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm"
                />
              </div>

              <div className={`space-y-1.5 transition-all duration-500 ${parseInt(age) >= 18 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={14} /> 所属阵营
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-white/20 rounded-md py-2.5 px-4 text-[var(--text-primary)] outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm appearance-none cursor-pointer"
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                <Palette size={14} /> 视觉风格 (World Style)
              </label>
              <div className="grid grid-cols-1 gap-2">
                 {AVATAR_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setAvatarStyle(style.id)}
                      className={`
                        text-left p-3 rounded-lg border transition-all flex items-center justify-between group
                        ${avatarStyle === style.id 
                           ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                           : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <span className={`text-sm font-bold ${avatarStyle === style.id ? 'text-[var(--bg-primary)]' : 'text-[var(--text-primary)]'}`}>
                        {style.name}
                      </span>
                      <span className={`text-[10px] font-mono group-hover:text-white ${avatarStyle === style.id ? 'text-[var(--bg-primary)]' : 'text-[var(--text-secondary)]'}`}>{style.desc}</span>
                    </button>
                 ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!nickname || !age}
            className={`
              w-full mt-8 py-3.5 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300
              ${(!nickname || !age) 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-[var(--accent-color)] text-[var(--bg-primary)] hover:brightness-110 shadow-[0_0_20px_var(--accent-color)]'
              }
            `}
            style={{ borderRadius: avatarStyle === 'cyberpunk' ? '0px' : '8px' }}
          >
            签发通行证 <ArrowRight size={16} />
          </button>
          
          <div className="mt-4 text-center text-[10px] text-[var(--text-secondary)] font-sans opacity-70">
            警告：进入华京市后，你所做的每一个选择都将改变命运。
          </div>

        </div>
      </div>
    </div>
  );
};
