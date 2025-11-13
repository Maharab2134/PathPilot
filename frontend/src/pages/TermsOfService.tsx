import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Scale,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BookOpen,
  Download,
  Calendar,
  Clock,
  Shield,
  Zap,
  Heart
} from 'lucide-react';

export const TermsOfService: React.FC = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'accounts', title: 'User Accounts', icon: UserCheck },
    { id: 'services', title: 'Our Services', icon: Zap },
    { id: 'usage', title: 'Acceptable Use', icon: BookOpen },
    { id: 'intellectual', title: 'Intellectual Property', icon: Shield },
    { id: 'liability', title: 'Liability', icon: Scale },
    { id: 'termination', title: 'Termination', icon: XCircle }
  ];

  const termsContent = {
    acceptance: {
      title: "Acceptance of Terms",
      summary: "By accessing or using PathPilot, you agree to be bound by these Terms of Service.",
      clauses: [
        {
          title: "Agreement to Terms",
          content: "By accessing or using our website, mobile application, or services, you confirm that you have read, understood, and agree to be bound by these Terms of Service."
        },
        {
          title: "Modifications",
          content: "We reserve the right to modify these terms at any time. We will provide notice of material changes via email or through our platform. Continued use after changes constitutes acceptance."
        },
        {
          title: "Eligibility",
          content: "You must be at least 16 years old to use our services. By using PathPilot, you represent that you meet this age requirement and have the legal capacity to enter into this agreement."
        }
      ]
    },
    accounts: {
      title: "User Accounts",
      summary: "Rules and responsibilities for maintaining your PathPilot account.",
      clauses: [
        {
          title: "Account Creation",
          content: "You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your login credentials."
        },
        {
          title: "Account Security",
          content: "You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breaches."
        },
        {
          title: "Account Termination",
          content: "You may delete your account at any time through your account settings. We reserve the right to suspend or terminate accounts that violate these terms."
        }
      ]
    },
    services: {
      title: "Our Services",
      summary: "Description of the services we provide and your rights regarding them.",
      clauses: [
        {
          title: "Service Description",
          content: "PathPilot provides career assessment tools, personalized recommendations, learning resources, and career guidance services through our platform."
        },
        {
          title: "Service Modifications",
          content: "We continuously improve our services and may add, modify, or remove features at our discretion. We will provide notice of significant changes that may affect your experience."
        },
        {
          title: "Free and Paid Services",
          content: "We offer both free and premium services. Premium features require payment and are subject to additional terms outlined in our pricing plan."
        }
      ]
    },
    usage: {
      title: "Acceptable Use",
      summary: "Rules for using our services responsibly and legally.",
      clauses: [
        {
          title: "Prohibited Activities",
          content: "You may not use our services for any illegal purpose, to harass others, to distribute malware, or to attempt to gain unauthorized access to our systems."
        },
        {
          title: "Content Guidelines",
          content: "You may not submit content that is defamatory, obscene, infringing on intellectual property rights, or otherwise objectionable."
        },
        {
          title: "Commercial Use",
          content: "Personal use of our services is permitted. Commercial use requires written permission and may be subject to additional terms and fees."
        }
      ]
    },
    intellectual: {
      title: "Intellectual Property",
      summary: "Ownership and usage rights for content and technology.",
      clauses: [
        {
          title: "Our Intellectual Property",
          content: "All content, features, and functionality on PathPilot, including text, graphics, logos, and software, are owned by us or our licensors and are protected by intellectual property laws."
        },
        {
          title: "Your Content",
          content: "You retain ownership of the personal data and content you submit. By using our services, you grant us a license to use this data to provide and improve our services."
        },
        {
          title: "Feedback",
          content: "Any feedback, suggestions, or ideas you provide may be used by us to improve our services without obligation to compensate you."
        }
      ]
    },
    liability: {
      title: "Liability and Disclaimers",
      summary: "Limitations of our responsibility and important disclaimers.",
      clauses: [
        {
          title: "Service Availability",
          content: "We strive to provide reliable service but cannot guarantee uninterrupted access. We are not liable for any downtime or service interruptions."
        },
        {
          title: "Career Advice Disclaimer",
          content: "Our career recommendations are based on algorithms and data analysis. They should not be considered as professional career advice. Always consult with qualified professionals for major career decisions."
        },
        {
          title: "Limitation of Liability",
          content: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services."
        }
      ]
    },
    termination: {
      title: "Termination",
      summary: "Conditions under which accounts or access may be terminated.",
      clauses: [
        {
          title: "By You",
          content: "You may stop using our services and delete your account at any time. Certain provisions will survive termination, including intellectual property rights and liability limitations."
        },
        {
          title: "By Us",
          content: "We may suspend or terminate your access if you violate these terms, for extended inactivity, or if required by law. We will provide notice when possible."
        },
        {
          title: "Effect of Termination",
          content: "Upon termination, your right to use our services ceases immediately. We may retain certain data as required by law or for legitimate business purposes."
        }
      ]
    }
  };

  const importantPoints = [
    {
      icon: CheckCircle,
      title: "You own your data",
      description: "Your personal information and assessment results belong to you"
    },
    {
      icon: AlertTriangle,
      title: "Use responsibly",
      description: "Our recommendations are tools, not professional advice"
    },
    {
      icon: Shield,
      title: "We protect your privacy",
      description: "Your data is secure and never sold to third parties"
    },
    {
      icon: Heart,
      title: "We're here to help",
      description: "Contact us with any questions about these terms"
    }
  ];

  const currentSection = termsContent[activeSection as keyof typeof termsContent];

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
            <Scale className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Legal Terms
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
            Terms of Service
          </h1>
          <p className="max-w-3xl mx-auto mb-6 text-xl text-gray-600 dark:text-gray-400">
            Please read these terms carefully before using our services.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-gray-500 sm:flex-row dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Effective: December 1, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: December 1, 2024</span>
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
                  Terms Sections
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
                    Document Actions
                  </h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="justify-start w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="justify-start w-full gap-2">
                      <FileText className="w-4 h-4" />
                      Print Terms
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card className="mt-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Key Points
                </h3>
                <div className="space-y-4">
                  {importantPoints.map((point, index) => {
                    const Icon = point.icon;
                    return (
                      <div key={point.title} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {point.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {point.description}
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
                  <Badge variant="outline" className="text-sm">
                    Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
                  </Badge>
                </div>

                <div className="space-y-8">
                  <p className="py-1 pl-4 text-lg leading-relaxed text-gray-600 border-l-4 border-blue-500 dark:text-gray-300">
                    {currentSection.summary}
                  </p>

                  {currentSection.clauses.map((clause, index) => (
                    <div key={index} className="pt-6 border-t border-gray-200 dark:border-gray-700 first:border-t-0 first:pt-0">
                      <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full dark:bg-blue-900/30">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        {clause.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                        {clause.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Important Notice */}
                {activeSection === 'liability' && (
                  <div className="p-4 mt-8 border border-red-200 rounded-xl bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="mb-1 font-semibold text-red-800 dark:text-red-300">
                          Important Legal Notice
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          Our career recommendations are generated by algorithms and should not be considered as professional career advice. Always consult with qualified professionals for major career decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agreement Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 mt-8 text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <div className="text-center">
                <h3 className="mb-3 text-2xl font-bold">
                  Agreement Confirmation
                </h3>
                <p className="max-w-2xl mx-auto mb-6 text-blue-100">
                  By using PathPilot, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" className="rounded-xl">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    I Understand & Agree
                  </Button>
                  <Button variant="outline" size="lg" className="text-white border-white rounded-xl hover:bg-white hover:text-blue-600">
                    <FileText className="w-5 h-5 mr-2" />
                    Download Full Terms
                  </Button>
                </div>
                <p className="mt-4 text-sm text-blue-200">
                  Need clarification? <button className="underline hover:text-white">Contact our legal team</button>
                </p>
              </div>
            </motion.div>

            {/* Related Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Related Documents
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Privacy Policy
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          How we protect and use your data
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Read Privacy Policy
                    </Button>
                  </CardContent>
                </Card>
                <Card className="transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Cookie Policy
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          How we use cookies and tracking
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Read Cookie Policy
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};