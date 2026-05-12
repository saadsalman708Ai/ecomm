import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { COLLECTIONS, DOCUMENTS } from '../../../lib/firebase/collections';
import { ContactConfig } from '../../../types/homeSection';
import { MessageCircle, Facebook, ArrowLeft, Home, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { OrderSuspenseLoader } from '../../../components/shared/OrderSuspenseLoader';

export default function ContactPage() {
  const [config, setConfig] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.CONFIG, DOCUMENTS.CONTACT_CONFIG);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setConfig(snap.data() as ContactConfig);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) {
    return <OrderSuspenseLoader />;
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center p-4 md:p-8 mt-4 md:mt-8">
      <div className="bg-white border border-border p-8 rounded-3xl shadow-sm text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-foreground mb-2">Support & Contact</h1>
        <p className="text-foreground-muted mb-8 text-sm">Reach out to us. We are here to help!</p>

          <div className="flex flex-col gap-4">
            {config?.whatsapp?.enabled && config.whatsapp.number && (
              <a 
                href={`https://wa.me/${config.whatsapp.number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                <MessageCircle size={24} />
                <span>WhatsApp</span>
              </a>
            )}

            {config?.facebook?.enabled && config.facebook.url && (
              <a 
                href={config.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                <Facebook size={24} />
                <span>Facebook</span>
              </a>
            )}

            {(!config?.whatsapp?.enabled && !config?.facebook?.enabled) && (
              <div className="text-sm text-foreground-muted bg-gray-50 py-4 rounded-xl border border-border">
                No contact information available.
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
