"use client";

import { MANDATORY_ALLERGENS, RECOMMENDED_ALLERGENS, STAFF_CHECK } from "@/lib/allergens";

interface AllergenSelectorProps {
  selected: string[];
  onToggle: (allergen: string) => void;
  /** "exclude" = 来場者（除去したい食材）, "include" = 管理者（含むアレルゲン） */
  mode?: "exclude" | "include";
}

export default function AllergenSelector({
  selected,
  onToggle,
  mode = "exclude",
}: AllergenSelectorProps) {
  const selectedStyle =
    mode === "exclude"
      ? { backgroundColor: "#dc2626", borderColor: "#dc2626", color: "white" }
      : { backgroundColor: "#2563eb", borderColor: "#2563eb", color: "white" };

  const staffCheckSelected = selected.includes(STAFF_CHECK);

  return (
    <div className="space-y-5">
      {/* スタッフにお聞きください（includeモードのみ） */}
      {mode === "include" && (
        <div>
          <button
            type="button"
            onClick={() => onToggle(STAFF_CHECK)}
            className="px-3 py-2 rounded-xl text-xs font-medium border transition-all"
            style={
              staffCheckSelected
                ? { backgroundColor: "#f59e0b", borderColor: "#f59e0b", color: "white" }
                : { borderColor: "#fcd34d", color: "#92400e", backgroundColor: "#fffbeb" }
            }
          >
            ⚠️ スタッフにお聞きください
          </button>
          <p className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
            アレルゲン情報が不明な場合はこちらを選択
          </p>
        </div>
      )}
      {/* 特定8品目（義務表示） */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
            義務表示
          </span>
          <span className="text-xs text-gray-500">特定8品目</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {MANDATORY_ALLERGENS.map((allergen) => {
            const isSelected = selected.includes(allergen);
            return (
              <button
                key={allergen}
                type="button"
                onClick={() => onToggle(allergen)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={
                  isSelected
                    ? selectedStyle
                    : {
                        borderColor: "#fca5a5",
                        color: "#b91c1c",
                        backgroundColor: "#fef2f2",
                      }
                }
              >
                {allergen}
              </button>
            );
          })}
        </div>
      </div>

      {/* 特定21品目（推奨表示） */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
          >
            推奨表示
          </span>
          <span className="text-xs text-gray-500">特定21品目</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED_ALLERGENS.map((allergen) => {
            const isSelected = selected.includes(allergen);
            return (
              <button
                key={allergen}
                type="button"
                onClick={() => onToggle(allergen)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={
                  isSelected
                    ? selectedStyle
                    : {
                        borderColor: "#fcd34d",
                        color: "#92400e",
                        backgroundColor: "#fffbeb",
                      }
                }
              >
                {allergen}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
