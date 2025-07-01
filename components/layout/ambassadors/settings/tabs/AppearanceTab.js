"use client";

import {
  Sun,
  Moon,
  Palette,
  Monitor,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { addToast } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Chip } from "@heroui/react";

const AppearanceTab = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);

    addToast({
      title: "Theme Changed",
      description: `Switched to ${newTheme} theme`,
      color: "success",
      timeout: 2000,
    });
  };

  const themeOptions = [
    {
      id: "dark",
      name: "Dark",
      description:
        "Dark theme with reduced eye strain for low light environments",
      icon: Moon,
      preview: "bg-gray-900 border-gray-700",
    },
    {
      id: "light",
      name: "Light",
      description:
        "Clean light theme with high contrast for better readability",
      icon: Sun,
      preview: "bg-white border-gray-300",
    },
    {
      id: "system",
      name: "System",
      description: "Automatically follows your device's theme preference",
      icon: Monitor,
      preview: "bg-gradient-to-r from-gray-900 to-white border-gray-500",
    },
  ];

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="mx-auto mt-10 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
        <h3 className="mb-2 text-lg font-medium text-white">
          Loading Theme Settings
        </h3>
        <p className="text-sm text-gray-200">
          Initializing appearance preferences...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-pink-600/20 flex h-12 w-12 items-center justify-center rounded-xl">
          <Palette size={24} className="text-pink-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">Appearance</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Customize your interface theme
            </span>

            <Chip size="sm" variant="flat" color="success">
              Current:{" "}
              {theme === "system" ? `System (${resolvedTheme})` : theme}
            </Chip>
          </div>
        </div>
      </div>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Palette size={20} className="text-pink-400" />

            <h3 className="text-lg font-semibold text-white">
              Theme Selection
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {themeOptions.map((themeOption) => {
              const IconComponent = themeOption.icon;
              const isSelected = theme === themeOption.id;

              return (
                <Card
                  key={themeOption.id}
                  className={`cursor-pointer border transition-all hover:scale-[1.02] ${
                    isSelected
                      ? "border-pink-500/50 bg-gradient-to-br from-pink-900/20 to-purple-900/20 ring-2 ring-pink-500/20"
                      : "border-gray-700/50 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-gray-600/50"
                  }`}
                  isPressable
                  onPress={() => handleThemeChange(themeOption.id)}
                >
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`h-16 w-16 rounded-xl ${themeOption.preview} flex items-center justify-center`}
                        >
                          <IconComponent
                            size={28}
                            className={
                              isSelected ? "text-pink-400" : "text-gray-400"
                            }
                          />
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <CheckCircle size={20} className="text-pink-400" />
                            <Chip size="sm" color="success" variant="flat">
                              Active
                            </Chip>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="mb-2 text-lg font-semibold text-white">
                          {themeOption.name}
                        </h4>

                        <p className="text-sm leading-relaxed text-gray-400">
                          {themeOption.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="bg-pink-900/20 flex items-center gap-2 rounded-lg border border-pink-500/20 p-2">
                          <div className="bg-pink-500 h-2 w-2 rounded-full"></div>

                          <span className="text-xs font-medium text-pink-400">
                            Currently Applied
                          </span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Monitor size={20} className="text-blue-400" />

            <h3 className="text-lg font-semibold text-white">
              Theme Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-pink-600/20 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Palette size={20} className="text-pink-400" />
                </div>

                <div>
                  <h4 className="font-medium text-white">Active Theme</h4>
                  <p className="text-sm text-gray-400">
                    Currently applied theme
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Selected:</span>
                  <span className="text-sm font-medium capitalize text-white">
                    {theme}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Resolved:</span>
                  <span className="text-sm font-medium capitalize text-white">
                    {resolvedTheme}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
              <h4 className="mb-3 font-medium text-white">Color Preview</h4>

              <div className="grid grid-cols-4 gap-2">
                <div className="h-8 rounded bg-gray-800"></div>
                <div className="bg-pink-600/20 h-8 rounded"></div>
                <div className="bg-blue-600/20 h-8 rounded"></div>
                <div className="h-8 rounded bg-green-600/20"></div>
                <div className="h-8 rounded bg-purple-600/20"></div>
                <div className="h-8 rounded bg-yellow-600/20"></div>
                <div className="h-8 rounded bg-red-600/20"></div>
                <div className="h-8 rounded bg-cyan-600/20"></div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Theme color palette preview
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {theme === "system" && (
        <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <Monitor size={20} className="mt-0.5 text-blue-400" />

              <div>
                <h4 className="mb-2 font-medium text-blue-400">
                  System Theme Active
                </h4>

                <p className="mb-3 text-sm text-gray-300">
                  Your theme automatically switches based on your device's
                  preference. Currently showing{" "}
                  <span className="font-medium text-white">
                    {resolvedTheme}
                  </span>{" "}
                  theme.
                </p>

                <div className="flex items-center gap-2">
                  <div className="bg-blue-500 h-2 w-2 rounded-full"></div>

                  <span className="text-xs text-blue-400">
                    Updates automatically with system changes
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 text-yellow-400" />

            <div>
              <h4 className="mb-2 font-medium text-yellow-400">
                Theme Guidelines
              </h4>

              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>

                  <span>
                    Dark theme reduces eye strain in low light conditions
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-400"></div>

                  <span>
                    Light theme provides better contrast for reading during the
                    day
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>

                  <span>
                    System theme automatically adapts to your device settings
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-pink-400 h-1.5 w-1.5 rounded-full"></div>

                  <span>
                    Theme preference is saved and will persist across sessions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AppearanceTab;
