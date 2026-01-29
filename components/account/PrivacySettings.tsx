"use client";

import { useState } from "react";
import Button from "@/components/common/Button";

interface PrivacyState {
  personalizedRecommendations: boolean;
  shareActivityForRewards: boolean;
}

const DEFAULT: PrivacyState = {
  personalizedRecommendations: true,
  shareActivityForRewards: true,
};

export default function PrivacySettings() {
  const [state, setState] = useState<PrivacyState>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof PrivacyState, value: boolean) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // Placeholder: wire to a real API or Firestore doc if needed
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 border rounded-lg p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Privacy & data</h2>
        <p className="text-sm text-gray-600">
          Control how we use your shopping activity to personalize your
          experience and rewards.
        </p>
      </div>
      <div className="space-y-3">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={state.personalizedRecommendations}
            onChange={(e) =>
              update("personalizedRecommendations", e.target.checked)
            }
          />
          <span>
            <span className="block font-medium text-sm">
              Personalized recommendations
            </span>
            <span className="block text-sm text-gray-600">
              Use your browsing and purchase history to recommend products you
              may like.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={state.shareActivityForRewards}
            onChange={(e) =>
              update("shareActivityForRewards", e.target.checked)
            }
          />
          <span>
            <span className="block font-medium text-sm">
              Share activity for rewards
            </span>
            <span className="block text-sm text-gray-600">
              Allow us to use your store and online activity to calculate bonus
              points and loyalty perks.
            </span>
          </span>
        </label>
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save privacy settings"}
      </Button>
      {saved && (
        <p className="text-sm text-green-600 mt-1">Settings saved.</p>
      )}
    </section>
  );
}

