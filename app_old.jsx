import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import backgroundImage  from '@/assets/interview-bg.jpg'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Upload, Mic, Send, Type, User, FileText, Sun, Moon, Settings } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import { generateVideo, checkVideoStatus } from './services/heygen';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate('/upload');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full -bottom-20 -right-20 animate-pulse" />
      </div>

      <div className="w-full max-w-md relative animate-fadeIn">
        <div className="text-center mb-8">
          <div className="bg-white/90 p-4 rounded-full inline-block mb-4 shadow-lg backdrop-blur-sm animate-bounce-subtle">
            <img 
              src="src\assets\avatar.png" 
              alt="AI Interview Logo" 
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 animate-slideUp">AI Interview Platform</h1>
          <p className="text-gray-200 animate-slideUp delay-100">Prepare for your next interview</p>
        </div>
        
        <Card className="bg-white/90 shadow-lg backdrop-blur-sm animate-slideUp delay-200">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2 animate-slideUp delay-300">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-gray-300 transition-all hover:border-blue-400 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2 animate-slideUp delay-400">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-300 transition-all hover:border-blue-400 focus:border-blue-500"
                />
              </div>
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={handleLogin} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);

  return (
    <div 
      className="min-h-screen p-8 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      <div className="max-w-4xl mx-auto space-y-8 relative animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-slideUp">Document Upload</h1>
          <p className="text-gray-600 animate-slideUp delay-100">Upload your resume and job description to begin</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-slideUp delay-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Upload Resume</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50"
              >
                {resume ? (
                  <div className="space-y-2 animate-fadeIn">
                    <FileText className="h-12 w-12 mx-auto text-blue-500 animate-bounce-subtle" />
                    <p className="text-sm text-gray-600">{resume.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 animate-bounce-subtle" />
                    <p className="mt-2 text-gray-600">Drag and drop your resume or click to browse</p>
                  </>
                )}
                <Input
                  type="file"
                  className="mt-4"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-slideUp delay-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Upload Job Description</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50"
              >
                {jobDescription ? (
                  <div className="space-y-2 animate-fadeIn">
                    <FileText className="h-12 w-12 mx-auto text-blue-500 animate-bounce-subtle" />
                    <p className="text-sm text-gray-600">{jobDescription.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 animate-bounce-subtle" />
                    <p className="mt-2 text-gray-600">Drag and drop job description or click to browse</p>
                  </>
                )}
                <Input
                  type="file"
                  className="mt-4"
                  onChange={(e) => setJobDescription(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={() => navigate('/interview')}
          disabled={!resume || !jobDescription}
          className="w-full max-w-md mx-auto mt-8 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] animate-slideUp delay-400"
        >
          <Send className="h-5 w-5 mr-2" />
          <span>Start Interview</span>
        </Button>
      </div>
    </div>
  );
};

// Theme Context
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Switcher Component
const ThemeSwitcher = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

// Modified InterviewPage
const InterviewPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcripts, setTranscripts] = useState([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [settings, setSettings] = useState({
    language: 'English',
    difficulty: 'Medium',
    duration: '30 mins'
  });

  const handleVideoError = (error) => {
    console.error('Video playback error:', error);
    setError('Failed to play video response. Please try again.');
    setIsGenerating(false);
    setIsAISpeaking(false);
  };

  const generateResponse = async (text) => {
    try {
      setIsGenerating(true);
      setIsAISpeaking(true);
      setError(null);
  
      console.log('Starting video generation with text:', text);
      const { task_id } = await generateVideo(text);
      console.log('Received task ID:', task_id);
      
      const checkCompletion = async () => {
        try {
          console.log('Checking status for task:', task_id);
          const status = await checkVideoStatus(task_id);
          console.log('Received status:', status);
          
          if (status.status === 'completed' && status.video_url) {
            console.log('Video completed, URL:', status.video_url);
            if (videoRef.current) {
              console.log('Setting video source...');
              videoRef.current.src = status.video_url;
              console.log('Video source set');
  
              videoRef.current.onloadeddata = async () => {
                try {
                  console.log('Video data loaded, attempting to play...');
                  await videoRef.current.play();
                  console.log('Video playing successfully');
                  setIsGenerating(false);
                } catch (playError) {
                  console.error('Play error:', playError);
                  handleVideoError(playError);
                }
              };
              
              videoRef.current.onerror = (e) => {
                console.error('Video element error:', e);
                handleVideoError(e);
              };
              
              videoRef.current.onended = () => {
                console.log('Video playback ended');
                setIsAISpeaking(false);
              };
            } else {
              console.error('Video ref is null');
              throw new Error('Video reference not available');
            }
          } else if (status.status === 'processing') {
            console.log('Video still processing, checking again in 2 seconds...');
            setTimeout(checkCompletion, 2000);
          } else if (status.status === 'failed') {
            console.error('Video generation failed:', status.error);
            throw new Error(status.error || 'Video generation failed');
          }
        } catch (checkError) {
          console.error('Status check error:', checkError);
          throw new Error(`Failed to check video status: ${checkError.message}`);
        }
      };
  
      await checkCompletion();
  
    } catch (error) {
      console.error('Error generating AI response:', error);
      setError(`Failed to generate response: ${error.message}`);
      setIsGenerating(false);
      setIsAISpeaking(false);
    }
  };

  const startInterview = async () => {
    try {
      setIsInterviewStarted(true);
      const initialGreeting = "Hello! I'm your AI interviewer today. Let's begin with your introduction. Please tell me about yourself and your background.";
      
      setTranscripts([{ 
        timestamp: new Date().toLocaleTimeString(), 
        content: initialGreeting
      }]);

      await generateResponse(initialGreeting);
    } catch (error) {
      setError('Failed to start interview. Please try again.');
      setIsInterviewStarted(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const userMessage = inputText.trim();
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
      setInputText('');

      // Add user message to transcript
      setTranscripts(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        content: `You: ${userMessage}`
      }]);

      try {
        // Simulate AI thinking about response
        const aiResponse = `Thank you for sharing that. Let me ask you a follow-up question about your experience.`;
        
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
        setTranscripts(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          content: `AI: ${aiResponse}`
        }]);

        await generateResponse(aiResponse);
      } catch (error) {
        setError('Failed to generate response. Please try again.');
      }
    }
  };

  const AvatarVideo = () => (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        onError={handleVideoError}
      />
      
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-200">Generating AI Response...</p>
          </div>
        </div>
      )}
      
      {isAISpeaking && !isGenerating && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 animate-pulse">
            Speaking
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="absolute bottom-4 left-4 right-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  const ThemeSwitcher = () => {
    const { theme, setTheme } = React.useContext(ThemeContext);
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="text-gray-400 hover:text-gray-300"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI Interview Platform</h1>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 text-gray-200">
                <DropdownMenuItem>
                  Language: {settings.language}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Difficulty: {settings.difficulty}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Duration: {settings.duration}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Interview Container */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="aspect-video bg-gray-700/50 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0">
                  {!isInterviewStarted ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-4 p-1 animate-pulse">
                          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-300" />
                          </div>
                        </div>
                        <Button
                          onClick={startInterview}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full"
                        >
                          Start Interview
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 relative">
                        <AvatarVideo />
                        
                        {/* Controls */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800/80 px-4 py-2 rounded-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCameraOn(!isCameraOn)}
                            className={`${!isCameraOn && 'text-red-500'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMicOn(!isMicOn)}
                            className={`${!isMicOn && 'text-red-500'}`}
                          >
                            <Mic className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Live Transcript */}
                      <div className="bg-gray-900/50 p-4 rounded-b-lg">
                        <div className="text-gray-300 text-sm font-mono">
                          {transcripts.length > 0 && transcripts[transcripts.length - 1].content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Transcript History */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-semibold">Transcript History</h3>
              </CardHeader>
              <CardContent>
                <div className="h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                  {transcripts.map((transcript, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-500">{transcript.timestamp}</span>
                      <p className="text-gray-300">{transcript.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-semibold">Chat</h3>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-200'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex space-x-2">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700/50 text-gray-200"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isGenerating}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};



const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/interview" element={<InterviewPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;