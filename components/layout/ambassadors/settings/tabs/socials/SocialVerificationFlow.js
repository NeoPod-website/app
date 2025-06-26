"use client";

import {
  Users,
  Globe,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { Card, CardBody, Button, Chip } from "@heroui/react";

const SocialVerificationFlow = ({ platform, onBack }) => {
  const formatRequirements = (verification) => {
    const requirements = [];

    if (verification.minFollowers) {
      requirements.push({
        text: `${verification.minFollowers}+ followers`,
        icon: Users,
      });
    }

    if (verification.minSubscribers) {
      requirements.push({
        text: `${verification.minSubscribers}+ subscribers`,
        icon: Users,
      });
    }

    if (verification.minConnections) {
      requirements.push({
        text: `${verification.minConnections}+ connections`,
        icon: Users,
      });
    }

    if (verification.minAccountAge) {
      requirements.push({
        text: `Account ${verification.minAccountAge}+ days old`,
        icon: Calendar,
      });
    }

    if (verification.minServerCount) {
      requirements.push({
        text: `Member of ${verification.minServerCount}+ servers`,
        icon: Globe,
      });
    }

    if (verification.requiresVerifiedEmail) {
      requirements.push({
        text: "Verified email address",
        icon: ShieldCheck,
      });
    }

    if (verification.requiresUsername) {
      requirements.push({
        text: "Public username required",
        icon: ShieldCheck,
      });
    }

    return requirements;
  };

  const requirements = formatRequirements(platform.verification);

  // Build OAuth URL with return path
  const returnUrl = encodeURIComponent("/settings?tab=socials");
  const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.login}?returnUrl=${returnUrl}`;
  // const oauthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.X_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.X_REDIRECT_URI)}&scope=users.read&state=abc&code_challenge=challenge&code_challenge_method=plain`;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button isIconOnly variant="flat" size="sm" onPress={onBack}>
          <ArrowLeft size={16} />
        </Button>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Connect {platform.name}
          </h2>

          <p className="text-gray-200">
            Ready to connect your {platform.name} account to your ambassador
            profile
          </p>
        </div>
      </div>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-8">
          <div className="mb-8 text-center">
            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${platform.color}/20`}
            >
              <img
                src={platform.icon}
                alt={platform.name}
                className="h-10 w-10 rounded"
              />
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white">
              Connect to {platform.name}
            </h3>

            <p className="mx-auto mb-6 max-w-2xl text-gray-200">
              {platform.description}
            </p>
          </div>

          {requirements.length > 0 && (
            <div className="bg-blue-900/20 mb-6 rounded-xl border border-blue-500/20 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 text-blue-400" />

                <div>
                  <p className="mb-3 text-sm font-medium text-blue-400">
                    Verification Requirements
                  </p>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {requirements.map((req, index) => {
                      const IconComponent = req.icon;

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-200"
                        >
                          <IconComponent size={14} className="text-blue-300" />
                          <span>{req.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 rounded-xl bg-gray-800/50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-300">
              Permissions We'll Request:
            </p>

            <div className="flex flex-wrap gap-2">
              {platform.requiredScopes.map((scope, index) => (
                <Chip key={index} size="sm" variant="bordered">
                  {scope}
                </Chip>
              ))}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Read-only access • No posting permissions • Secure OAuth 2.0
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-900/20 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 text-green-400" />

              <div>
                <p className="mb-2 text-sm font-medium text-green-400">
                  Secure Authentication
                </p>

                <div className="space-y-1 text-xs text-gray-300">
                  <p>• Your credentials are never stored on our servers</p>
                  <p>• Only basic profile information is accessed</p>
                  <p>• You can disconnect at any time</p>
                  <p>• Industry-standard OAuth 2.0 security</p>
                </div>
              </div>
            </div>
          </div>

          <Link href={oauthUrl} className="block">
            <Button
              size="lg"
              className={`w-full ${platform.color} font-semibold text-white`}
              endContent={<ExternalLink size={16} />}
            >
              Connect {platform.name} Account
            </Button>
          </Link>
        </CardBody>
      </Card>

      <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            What happens next?
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/20">
                <span className="text-xs font-bold text-purple-400">1</span>
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Redirect to {platform.name}
                </p>

                <p className="text-xs text-gray-400">
                  You'll be securely redirected to {platform.name}'s
                  authorization page
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/20">
                <span className="text-xs font-bold text-purple-400">2</span>
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Grant Permission
                </p>

                <p className="text-xs text-gray-400">
                  Authorize our app to access your basic profile information
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/20">
                <span className="text-xs font-bold text-purple-400">3</span>
              </div>

              <div>
                <p className="text-sm font-medium text-white">Return Here</p>

                <p className="text-xs text-gray-400">
                  You'll be redirected back to this page with your account
                  connected
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 text-yellow-400" />

            <div>
              <h4 className="mb-2 font-medium text-yellow-400">
                Need help connecting?
              </h4>

              <div className="space-y-1 text-sm text-gray-100">
                <p>• Make sure pop-ups are enabled for this site</p>
                <p>• Ensure you're logged into {platform.name}</p>
                <p>• Check your internet connection</p>
                <p>• Try using a different browser if issues persist</p>
              </div>

              <div className="mt-4">
                <Button size="sm" variant="flat" onPress={onBack}>
                  Back to Social Connections
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SocialVerificationFlow;
