import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  CheckCircle
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'support@pathpilot.com',
      link: 'mailto:support@pathpilot.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: '123 Career Street, Tech City, TC 12345',
      link: '#'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      description: 'Mon - Fri: 9:00 AM - 6:00 PM EST',
      link: '#'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card>
              <CardContent className="p-12">
                <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
                  Message Sent!
                </h1>
                <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-6">
                  Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Have questions about PathPilot? We're here to help and would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Contact Information
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <motion.a
                        key={info.title}
                        href={info.link}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                          <Icon className="text-primary-600 dark:text-primary-400" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900 dark:text-white">
                            {info.title}
                          </h3>
                          <p className="text-secondary-600 dark:text-secondary-400">
                            {info.description}
                          </p>
                        </div>
                      </motion.a>
                    );
                  })}
                </CardContent>
              </Card>

              {/* FAQ Card */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Quick Help
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    Check out our frequently asked questions for quick answers to common questions.
                  </p>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2" size={16} />
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Send us a Message
                  </h2>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      required
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="block w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-secondary-900 placeholder-secondary-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white dark:placeholder-secondary-400 resize-none"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      loading={loading}
                      disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
                    >
                      <Send className="mr-2" size={18} />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="text-primary-600" size={20} />
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Our Location
                </h3>
              </div>
              <div className="bg-secondary-200 dark:bg-secondary-700 rounded-lg h-64 flex items-center justify-center">
                <p className="text-secondary-500 dark:text-secondary-400">
                  Interactive map would be embedded here
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};