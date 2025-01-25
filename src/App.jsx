import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import backgroundImage  from '@/assets/interview-bg.jpg'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Upload, Mic, Send, Type, User, FileText, Sun, Moon, Settings } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import { useHeyGenStreaming } from './services/heygen';
import auth, { signInWithGoogle, sendOTP, verifyOTP } from "./lib/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { ThemeProvider } from './ThemeProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOTPMode, setIsOTPMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/upload');
      }
    });

    // Check for OTP verification on component mount
    const verifyEmailLink = async () => {
      try {
        await verifyOTP();
        navigate('/upload');
      } catch (error) {
        // OTP verification failed or not an OTP link
      }
    };

    verifyEmailLink();

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isOTPMode) {
        await sendOTP(email);
        setError('OTP sent to your email. Please check your inbox.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/upload');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/upload');
    } catch (error) {
      setError(error.message);
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
      {/* Existing background and overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full -bottom-20 -right-20 animate-pulse" />
      </div>

      <div className="w-full max-w-md relative animate-fadeIn">
        <div className="text-center mb-8">
          {/* Existing logo and title */}
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
              {!isOTPMode && (
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
              )}
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isOTPMode ? 'Send OTP' : 'Login'}
              </Button>
              <div className="text-center">
                <Button 
                  type="button"
                  variant="link"
                  onClick={() => setIsOTPMode(!isOTPMode)}
                  className="text-blue-600 hover:underline"
                >
                  {isOTPMode ? 'Back to Password Login' : 'Login with OTP'}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full mt-4 border-gray-300 hover:bg-gray-100"
              >
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateContact, setCandidateContact] = useState('');
  const [resume, setResume] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState(null);
  const [error, setError] = useState('');

  //const db = getFirestore();

  const handleSubmit = async () => {
    // Validation
    if (!candidateName || !candidateEmail || !candidateContact || !resume || !jobRole || !jobDescription) {
      setError('Please fill in all fields and upload required documents');
      return;
    }

    try {
      // Upload document details to Firestore
      const docRef = await addDoc(collection(db, 'interview_candidates'), {
        candidateName,
        candidateEmail,
        candidateContact,
        jobRole,
        uploadedAt: new Date()
      });

      // File upload logic would go here (not implemented in this example)
      navigate('/interview');
    } catch (err) {
      setError('Failed to submit interview details');
      console.error(err);
    }
  };

  return (
    <div 
      className="min-h-screen p-8 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      <div className="max-w-4xl mx-auto space-y-8 relative animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-slideUp">Interview Preparation</h1>
          <p className="text-gray-600 animate-slideUp delay-100">Complete your profile and upload documents</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-slideUp delay-200">
            <CardHeader>
              <h2 className="text-xl font-semibold">Candidate Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <Input
                  type="tel"
                  value={candidateContact}
                  onChange={(e) => setCandidateContact(e.target.value)}
                  placeholder="Enter your contact number"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-slideUp delay-300">
            <CardHeader>
              <h2 className="text-xl font-semibold">Job & Documents</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Role</label>
                <Input
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resume</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50"
                >
                  {resume ? (
                    <div className="space-y-2 animate-fadeIn">
                      <FileText className="h-12 w-12 mx-auto text-blue-500 animate-bounce-subtle" />
                      <p className="text-sm text-gray-600">{resume.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 animate-bounce-subtle" />
                      <p className="mt-2 text-gray-600">Drag and drop resume or click to browse</p>
                    </>
                  )}
                  <Input
                    type="file"
                    className="mt-4"
                    onChange={(e) => setResume(e.target.files[0])}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50"
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
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!candidateName || !candidateEmail || !candidateContact || !resume || !jobRole || !jobDescription}
          className="w-full max-w-md mx-auto mt-8 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] animate-slideUp delay-400"
        >
          <Send className="h-5 w-5 mr-2" />
          <span>Start Interview Preparation</span>
        </Button>
      </div>
    </div>
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

const InterviewPage = () => {
  const navigate = useNavigate();
  
  // State for interview and messaging
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
  
  // References
  const streamVideoRef = useRef(null);
  
  // HeyGen Streaming Hook
  const {
    createNewSession,
    startStreamingSession,
    sendTextToAvatar,
    closeSession,
    sessionInfo,
    peerConnection,
    streamStatus,
    error: streamError
  } = useHeyGenStreaming();

  // New state for WebRTC streaming
  const [isStreamReady, setIsStreamReady] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    language: 'English',
    difficulty: 'Medium',
    duration: '30 mins',
    avatarId: 'June_HR_public',
    voiceId: '2d5b0e6cf36f460aa7fc47e3eee4ba54'
  });

  // Start Interview Function
  const startInterview = async () => {
    try {
      // Reset previous states
      setMessages([]);
      setTranscripts([]);
      setError(null);

      // Setup HeyGen streaming session
      const { peerConnection: pc } = await createNewSession(
        settings.avatarId, 
        settings.voiceId
      );

      // Setup track handling for WebRTC
      pc.ontrack = (event) => {
        if (event.track.kind === 'video' && streamVideoRef.current) {
          streamVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Start streaming
      await startStreamingSession();
      setIsStreamReady(true);

      // Initial greeting
      const initialGreeting = "Hello! I'm your AI interviewer today. Let's begin with your introduction. Please tell me about yourself and your background.";
      
      setTranscripts(prev => [...prev, { 
        timestamp: new Date().toLocaleTimeString(), 
        content: initialGreeting
      }]);

      setMessages(prev => [...prev, { type: 'ai', content: initialGreeting }]);

      // Send greeting to avatar
      await sendTextToAvatar(initialGreeting);
      setIsInterviewStarted(true);

    } catch (error) {
      console.error('Interview start error:', error);
      setError('Failed to start interview. Please check your connection.');
      setIsInterviewStarted(false);
    }
  };

  // Send Message Handler
  const handleSendMessage = async () => {
    if (inputText.trim() && isStreamReady) {
      const userMessage = inputText.trim();
      
      // Update messages and transcripts
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
      setTranscripts(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        content: `You: ${userMessage}`
      }]);

      setInputText('');

      try {
        // Send user message to avatar
        await sendTextToAvatar(userMessage);

        // Simulate AI response
        const aiResponse = `Thank you for sharing that. Let me dig a bit deeper into your experience. ${userMessage.includes('work') ? 'Could you elaborate on your most significant professional achievement?' : 'What motivates you in your career?'}`;
        
        // Update messages and transcripts with AI response
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
        setTranscripts(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          content: `AI: ${aiResponse}`
        }]);

        // Send AI response to avatar
        await sendTextToAvatar(aiResponse);

      } catch (error) {
        console.error('Message send error:', error);
        setError('Failed to generate response. Please try again.');
      }
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (sessionInfo) {
        closeSession();
      }
    };
  }, [sessionInfo, closeSession]);

  // Avatar Video Component
  const AvatarVideo = () => (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={streamVideoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
      />
      
      {/* Loading Indicator */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-200">Processing Response...</p>
          </div>
        </div>
      )}

      {/* Stream Status Indicator */}
      {streamStatus && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className={`px-3 py-1 rounded-full text-xs ${
            streamStatus.includes('Failed') 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-green-500/20 text-green-400'
          } animate-pulse`}>
            {streamStatus}
          </div>
        </div>
      )}

      {/* Error Handling */}
      {(error || streamError) && (
        <Alert variant="destructive" className="absolute bottom-4 left-4 right-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || streamError}
          </AlertDescription>
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