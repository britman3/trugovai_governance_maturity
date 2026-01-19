"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PriorityBadge, EffortBadge, DimensionBadge } from "@/components/ui/Badge";
import { MaturityBadge } from "@/components/ui/MaturityBadge";
import { recommendations, getQuickWins } from "@/data/recommendations";
import { Dimension, ALL_DIMENSIONS, DIMENSIONS, Priority, Effort, MaturityLevel, MATURITY_LEVELS } from "@/types";

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const initialDimension = searchParams.get("dimension") as Dimension | null;

  const [selectedDimension, setSelectedDimension] = useState<Dimension | "all">(
    initialDimension || "all"
  );
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
  const [selectedEffort, setSelectedEffort] = useState<Effort | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<MaturityLevel | "all">("all");
  const [showQuickWins, setShowQuickWins] = useState(false);

  // Filter recommendations
  const filteredRecommendations = showQuickWins
    ? getQuickWins()
    : recommendations.filter(rec => {
        if (selectedDimension !== "all" && rec.dimension !== selectedDimension) return false;
        if (selectedPriority !== "all" && rec.priority !== selectedPriority) return false;
        if (selectedEffort !== "all" && rec.effort !== selectedEffort) return false;
        if (selectedLevel !== "all" && rec.currentLevel !== selectedLevel) return false;
        return true;
      });

  const clearFilters = () => {
    setSelectedDimension("all");
    setSelectedPriority("all");
    setSelectedEffort("all");
    setSelectedLevel("all");
    setShowQuickWins(false);
  };

  const hasActiveFilters =
    selectedDimension !== "all" ||
    selectedPriority !== "all" ||
    selectedEffort !== "all" ||
    selectedLevel !== "all" ||
    showQuickWins;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Recommendations Library</h1>
        <p className="text-slate700">
          Browse all recommendations for improving your AI governance maturity. Filter by dimension, priority, or effort level.
        </p>
      </div>

      {/* Quick Wins Banner */}
      <Card className={`mb-6 ${showQuickWins ? "ring-2 ring-mint300" : ""}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-mint300/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-navy">Quick Wins</h3>
              <p className="text-sm text-slate700">
                {getQuickWins().length} low-effort recommendations that can make an immediate impact
              </p>
            </div>
          </div>
          <Button
            variant={showQuickWins ? "primary" : "outline"}
            onClick={() => {
              setShowQuickWins(!showQuickWins);
              if (!showQuickWins) {
                setSelectedEffort("all");
                setSelectedPriority("all");
                setSelectedDimension("all");
                setSelectedLevel("all");
              }
            }}
          >
            {showQuickWins ? "Showing Quick Wins" : "Show Quick Wins Only"}
          </Button>
        </div>
      </Card>

      {/* Filters */}
      {!showQuickWins && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-teal hover:text-[#158a85]"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Dimension Filter */}
              <div>
                <label className="block text-sm font-medium text-slate700 mb-1">
                  Dimension
                </label>
                <select
                  value={selectedDimension}
                  onChange={(e) => setSelectedDimension(e.target.value as Dimension | "all")}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                >
                  <option value="all">All Dimensions</option>
                  {ALL_DIMENSIONS.map(dim => (
                    <option key={dim} value={dim}>{DIMENSIONS[dim].shortName}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-slate700 mb-1">
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority | "all")}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                >
                  <option value="all">All Priorities</option>
                  {Object.values(Priority).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Effort Filter */}
              <div>
                <label className="block text-sm font-medium text-slate700 mb-1">
                  Effort Level
                </label>
                <select
                  value={selectedEffort}
                  onChange={(e) => setSelectedEffort(e.target.value as Effort | "all")}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                >
                  <option value="all">All Effort Levels</option>
                  {Object.values(Effort).map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              {/* Current Level Filter */}
              <div>
                <label className="block text-sm font-medium text-slate700 mb-1">
                  Current Maturity Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value === "all" ? "all" : Number(e.target.value) as MaturityLevel)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                >
                  <option value="all">All Levels</option>
                  {Object.keys(MATURITY_LEVELS).map(level => (
                    <option key={level} value={level}>
                      Level {level} - {MATURITY_LEVELS[Number(level) as MaturityLevel].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate700">
        Showing {filteredRecommendations.length} recommendation{filteredRecommendations.length !== 1 ? "s" : ""}
      </div>

      {/* Recommendations Grid */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRecommendations.map(rec => (
            <Card key={rec.id} className="h-full flex flex-col">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <DimensionBadge dimension={DIMENSIONS[rec.dimension].shortName} />
                  <PriorityBadge priority={rec.priority} />
                  <EffortBadge effort={rec.effort} />
                </div>

                <h3 className="font-semibold text-navy text-lg mb-2">{rec.title}</h3>
                <p className="text-slate700 text-sm mb-4">{rec.description}</p>

                <div className="flex items-center gap-2 text-sm text-slate700">
                  <span>Progress from</span>
                  <MaturityBadge level={rec.currentLevel} size="sm" />
                  <span>to</span>
                  <MaturityBadge level={rec.targetLevel} size="sm" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={rec.toolkitLink}
                  className="inline-flex items-center gap-2 text-teal hover:text-[#158a85] font-medium text-sm"
                >
                  View in Toolkit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-slate700 mb-4">No recommendations match your current filters.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Integration Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>TruGovAI Toolkit Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate700 mb-4">
            These recommendations link directly to resources in the TruGovAI Toolkit:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "AI Tool Inventory", desc: "Track approved and prohibited AI tools" },
              { name: "Risk Scoring Matrix", desc: "Standardise risk assessments" },
              { name: "Training Modules", desc: "Staff education resources" },
              { name: "Vendor Vetting Checklist", desc: "Due diligence for AI vendors" },
              { name: "Incident Tracker", desc: "Log and track AI incidents" },
              { name: "Quarterly Audit Tracker", desc: "Maintain governance reviews" }
            ].map(tool => (
              <div key={tool.name} className="p-3 bg-ice rounded-lg">
                <p className="font-medium text-navy">{tool.name}</p>
                <p className="text-sm text-slate700">{tool.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate700">Loading recommendations...</div>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}
