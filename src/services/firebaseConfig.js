// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCr9T3pygyJbEoW7eiTOFLkZyV_RJnkB3E",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ecoadventuresm-74907.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ecoadventuresm-74907",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ecoadventuresm-74907.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "496212695530",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:496212695530:web:72191259a88544a115fa93"
};

// Verificar se as variáveis de ambiente estão configuradas
const isConfigured = Object.values(firebaseConfig).every(value => 
  value && !value.includes('SUA_') && !value.includes('SEU_')
);

if (!isConfigured) {
  console.warn('⚠️ Firebase não está totalmente configurado!');
  console.warn('📝 Para configurar o Firebase:');
  console.warn('1. Acesse https://console.firebase.google.com/');
  console.warn('2. Crie um novo projeto ou use um existente');
  console.warn('3. Vá em "Project Settings" > "Your apps" > "Config"');
  console.warn('4. Copie as credenciais para o arquivo .env');
  console.warn('5. Habilite o Firebase Storage em "Storage" no menu lateral');
  console.warn('6. Configure as regras de segurança do Storage');
}

// Inicializar Firebase apenas se estiver configurado
let app = null;
let storage = null;

try {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
}

export { storage };
export default app;
