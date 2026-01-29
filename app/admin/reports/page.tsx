"use client";

import { useEffect, useState } from "react";
import ReportFilters from "@/components/admin/ReportFilters";
import ChartsLegend from "@/components/admin/ChartsLegend";
import { formatPrice } from "@/lib/utils";
import type { TopProductRow, OrderStatsRow } from "@/types/admin";

type ReportType = "topProducts" | "orderStats";

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("orderStats");
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() =>
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState("");

  const loadReport = () => {
    setLoading(true);
    const type = reportType === "topProducts" ? "topProducts" : "orderStats";
    const params = new URLSearchParams({ type, days: "7", limit: "10" });
    fetch(`/api/admin/reports?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load report");
        return res.json();
      })
      .then((data: { type: string; data: TopProductRow[] | OrderStatsRow[] }) => {
        if (data.type === "topProducts") setTopProducts(data.data as TopProductRow[]);
        else setOrderStats(data.data as OrderStatsRow[]);
      })
      .finally(() => setLoading(false));
  };

  const legendItems = [
    { id: "orders", label: "Orders", color: "#111827" },
    { id: "revenue", label: "Revenue", color: "#059669" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setReportType("orderStats")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            reportType === "orderStats" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Order stats
        </button>
        <button
          type="button"
          onClick={() => setReportType("topProducts")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            reportType === "topProducts" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Top products
        </button>
      </div>
      <ReportFilters
        startDate={startDate}
        endDate={endDate}
        categoryId={categoryId}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoryChange={setCategoryId}
        onApply={loadReport}
        loading={loading}
      />
      {reportType === "topProducts" && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Product</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">Quantity sold</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((row) => (
                <tr key={row.productId}>
                  <td className="px-4 py-2 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{row.quantitySold}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{formatPrice(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {topProducts.length === 0 && !loading && (
            <p className="px-4 py-8 text-center text-gray-500">Click Apply to load top products.</p>
          )}
        </div>
      )}
      {reportType === "orderStats" && (
        <div>
          <ChartsLegend items={legendItems} />
          <div className="mt-4 rounded-lg border border-gray-200 bg-white overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">Orders</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderStats.map((row) => (
                  <tr key={row.date}>
                    <td className="px-4 py-2 text-gray-900">{row.date}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{row.orders}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{formatPrice(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orderStats.length === 0 && !loading && (
              <p className="px-4 py-8 text-center text-gray-500">Click Apply to load order stats.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
