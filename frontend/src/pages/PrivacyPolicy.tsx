import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Trash2,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart
} from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Eye },
    { id: 'data-collection', title: 'Data Collection', icon: Database },
    { id: 'data-usage', title: 'Data Usage', icon: UserCheck },
    { id: 'data-protection', title: 'Data Protection', icon: Lock },
    { id: 'your-rights', title: 'Your Rights', icon: Shield },
    { id: 'contact', title: 'Contact', icon: Heart }
  ];

  const policyContent = {
    overview: {
      title: "Privacy Overview",
      lastUpdated: "December 1, 2024",
      summary: "We are committed to protecting your privacy and being transparent about how we handle your personal information.",
      points: [
        "We collect only necessary information to provide our services",
        "Your data is encrypted and stored securely",
        "We never sell your personal information to third parties",
        "You have full control over your data and privacy settings"
      ]
    },
    'data-collection': {
      title: "Information We Collect",
      content: [
        {
          title: "Personal Information",
          items: [
            "Name and contact details",
            "Career preferences and assessment results",
            "Learning progress and quiz scores",
            "Account preferences and settings"
          ]
        },
        {
          title: "Technical Information",
          items: [
            "IP address and device information",
            "Browser type and version",
            "Usage patterns and interaction data",
            "Cookies and similar technologies"
          ]
        },
        {
          title: "Assessment Data",
          items: [
            "Quiz responses and results",
            "Career interest patterns",
            "Skill assessment data",
            "Learning progress metrics"
          ]
        }
      ]
    },
    'data-usage': {
      title: "How We Use Your Information",
      content: [
        {
          title: "Service Provision",
          items: [
            "Personalize your career recommendations",
            "Provide tailored learning paths",
            "Track and report your progress",
            "Improve assessment accuracy"
          ]
        },
        {
          title: "Communication",
          items: [
            "Send important service updates",
            "Provide customer support",
            "Share relevant career insights",
            "Notify about new features (with consent)"
          ]
        },
        {
          title: "Improvement & Analytics",
          items: [
            "Enhance our platform features",
            "Develop new assessment tools",
            "Conduct research (anonymized data)",
            "Ensure platform security"
          ]
        }
      ]
    },
    'data-protection': {
      title: "Data Protection & Security",
      content: [
        {
          title: "Security Measures",
          items: [
            "End-to-end encryption for all data",
            "Regular security audits and penetration testing",
            "Secure data centers with 24/7 monitoring",
            "Employee training on data protection"
          ]
        },
        {
          title: "Data Retention",
          items: [
            "Assessment data: 5 years (or until account deletion)",
            "Personal information: While account is active",
            "Analytics data: 2 years (anonymized)",
            "Backup data: 30 days maximum"
          ]
        },
        {
          title: "Third-Party Services",
          items: [
            "We use only GDPR-compliant service providers",
            "All partners undergo rigorous security checks",
            "Data processing agreements with all vendors",
            "Regular compliance monitoring"
          ]
        }
      ]
    },
    'your-rights': {
      title: "Your Privacy Rights",
      content: [
        {
          title: "Access & Control",
          items: [
            "Right to access your personal data",
            "Right to correct inaccurate information",
            "Right to delete your account and data",
            "Right to data portability"
          ]
        },
        {
          title: "Preferences",
          items: [
            "Control email communication preferences",
            "Adjust privacy settings at any time",
            "Opt-out of data processing where applicable",
            "Request data processing restrictions"
          ]
        },
        {
          title: "Complaints",
          items: [
            "Right to lodge complaints with authorities",
            "Direct contact with our Data Protection Officer",
            "Transparent complaint resolution process",
            "No retaliation for privacy complaints"
          ]
        }
      ]
    },
    contact: {
      title: "Contact Our Privacy Team",
      content: [
        {
          title: "Data Protection Officer",
          items: [
            "Email: privacy@pathpilot.com",
            "Response time: Within 48 hours",
            "Emergency contact: Available 24/7 for urgent matters"
          ]
        },
        {
          title: "General Inquiries",
          items: [
            "Email: support@pathpilot.com",
            "Live chat: Available during business hours",
            "Phone: +1 (555) 123-PRIVACY"
          ]
        },
        {
          title: "Legal Address",
          items: [
            "PathPilot Technologies Inc.",
            "123 Privacy Lane, Suite 100",
            "San Francisco, CA 94105",
            "United States"
          ]
        }
      ]
    }
  };

  const securityFeatures = [
    {
      icon: Lock,
      title: "Bank-Level Encryption",
      description: "All data encrypted in transit and at rest"
    },
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "Fully compliant with global privacy regulations"
    },
    {
      icon: Database,
      title: "Secure Infrastructure",
      description: "Enterprise-grade security infrastructure"
    },
    {
      icon: UserCheck,
      title: "Privacy by Design",
      description: "Privacy built into every feature from the start"
    }
  ];

  const currentSection = policyContent[activeSection as keyof typeof policyContent];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-gray-200 rounded-full shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Privacy Matters
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
            Privacy Policy
          </h1>
          <p className="max-w-3xl mx-auto mb-6 text-xl text-gray-600 dark:text-gray-400">
            We believe in transparency and putting you in control of your personal information.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-gray-500 sm:flex-row dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {policyContent.overview.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Reading time: 8 minutes</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm top-8">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Policy Sections
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Actions */}
                <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="justify-start w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="justify-start w-full gap-2">
                      <Trash2 className="w-4 h-4" />
                      Data Deletion Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="mt-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Our Security Commitment
                </h3>
                <div className="space-y-4">
                  {securityFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="flex items-center gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg dark:bg-green-900/30">
                          <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {feature.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentSection.title}
                  </h2>
                  {activeSection === 'overview' && (
                    <Badge className="text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Current Version
                    </Badge>
                  )}
                </div>

                {activeSection === 'overview' ? (
                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                      {'summary' in currentSection ? (currentSection as any).summary : ''}
                    </p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {'points' in currentSection && Array.isArray((currentSection as any).points) ? (
                        (currentSection as { points: string[] }).points.map((point, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
                          </div>
                        ))
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <>
                    {'content' in currentSection && Array.isArray((currentSection as any).content) ? (
                      <div className="space-y-8">
                        {(currentSection as { content: { title: string; items: string[] }[] }).content.map((section, index) => (
                          <div key={index}>
                            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                              {section.title}
                            </h3>
                            <ul className="space-y-3">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                                  <span className="leading-relaxed text-gray-600 dark:text-gray-300">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}

                {/* Important Notice */}
                {activeSection === 'data-protection' && (
                  <div className="p-4 mt-8 border border-yellow-200 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="mb-1 font-semibold text-yellow-800 dark:text-yellow-300">
                          Important Security Notice
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          We will never ask for your password via email or phone. Always ensure you're on our official website when entering sensitive information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 mt-8 text-center text-white rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <h3 className="mb-2 text-xl font-bold">
                Questions about your privacy?
              </h3>
              <p className="mb-4 text-green-100">
                Our privacy team is here to help you understand your rights and our practices.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="secondary" size="lg" className="rounded-xl">
                  <Shield className="w-5 h-5 mr-2" />
                  Contact Privacy Team
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white rounded-xl hover:bg-white hover:text-green-600">
                  <Download className="w-5 h-5 mr-2" />
                  Download Full Policy
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};