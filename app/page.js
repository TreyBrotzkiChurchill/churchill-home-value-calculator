"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

export default function Home() {
  const [homeValue, setHomeValue] = useState(400000);
  const [appreciationRate, setAppreciationRate] = useState(4);
  const [years, setYears] = useState(10);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const projection = useMemo(() => {
    const rate = appreciationRate / 100;
    return Array.from({ length: years + 1 }, (_, year) => {
      const value = homeValue * Math.pow(1 + rate, year);
      return {
        year,
        label: year === 0 ? "Today" : `Year ${year}`,
        value: Math.round(value),
        appreciation: Math.round(value - homeValue),
      };
    });
  }, [homeValue, appreciationRate, years]);

  const finalProjection = projection[projection.length - 1];

  const displayRows = projection.filter((_, index) => {
    const interval = Math.max(1, Math.ceil(projection.length / 5));
    return index % interval === 0 || index === projection.length - 1;
  });

  const handleHomeValueChange = (event) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, "");
    setHomeValue(Number(rawValue || 0));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSaved(false);

    const report = `
Churchill Mortgage Home Value Report

Lead email: ${email}
Current home value: ${formatter.format(homeValue)}
Average annual appreciation: ${appreciationRate}%
Projection length: ${years} years
Projected value: ${formatter.format(finalProjection.value)}
Estimated appreciation: ${formatter.format(finalProjection.appreciation)}
`;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          lead_email: email,
          current_home_value: formatter.format(homeValue),
          average_annual_appreciation: `${appreciationRate}%`,
          projection_length: `${years} years`,
          projected_value: formatter.format(finalProjection.value),
          estimated_appreciation: formatter.format(finalProjection.appreciation),
          report,
          notify: "trey.brotzki@churchillmortgage.com",
        }),
      });

      if (response.ok) {
        setSaved(true);
      } else {
        alert("The form did not send. Please check your Formspree endpoint in app/page.js.");
      }
    } catch (error) {
      alert("The form did not send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl"
        >
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-700 to-green-500 text-4xl font-bold text-white shadow-lg">
                ⌂
              </div>

              <div>
                <div className="text-5xl font-black tracking-wide text-slate-900">
                  CHURCHILL
                </div>
                <div className="text-lg font-bold uppercase tracking-[0.45em] text-slate-600">
                  Mortgage
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-green-100 bg-green-50 px-6 py-4 text-right shadow-sm">
              <div className="text-base font-semibold text-slate-700">
                Trusted. Experienced. Committed.
              </div>
              <div className="mt-1 text-lg font-bold text-green-700">
                That's Churchill.
              </div>
            </div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Home Value Appreciation Calculator
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-slate-600">
              Project your home's future value based on average appreciation in your area.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
            <div>
              <div className="rounded-[28px] border border-slate-200 bg-white shadow-lg">
                <div className="space-y-8 p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl text-green-700">
                      ⌂
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Your Inputs
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Enter your information to see your projection.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-bold text-slate-800">
                      Current Home Value
                    </label>
                    <input
                      inputMode="numeric"
                      value={homeValue ? homeValue.toLocaleString("en-US") : ""}
                      onChange={handleHomeValueChange}
                      className="mt-3 h-16 w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 text-2xl font-semibold outline-none focus:border-green-700"
                    />
                    <p className="mt-3 text-sm text-slate-500">
                      Enter your current home value
                    </p>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-base font-bold text-slate-800">
                        Average Annual Appreciation
                      </label>
                      <span className="text-4xl font-black text-green-700">
                        {appreciationRate.toFixed(0)}%
                      </span>
                    </div>

                    <input
                      type="range"
                      value={appreciationRate}
                      min={0}
                      max={10}
                      step={0.1}
                      onChange={(event) => setAppreciationRate(Number(event.target.value))}
                      className="mt-6 w-full accent-green-700"
                    />

                    <div className="mt-3 flex justify-between text-sm text-slate-500">
                      <span>0%</span>
                      <span>2%</span>
                      <span>4%</span>
                      <span>6%</span>
                      <span>8%</span>
                      <span>10%</span>
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      Adjust the average annual appreciation rate for your area
                    </p>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-base font-bold text-slate-800">
                        Projection Length
                      </label>
                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                        {years} Years
                      </span>
                    </div>

                    <input
                      type="range"
                      value={years}
                      min={1}
                      max={30}
                      step={1}
                      onChange={(event) => setYears(Number(event.target.value))}
                      className="mt-5 w-full accent-green-700"
                    />
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="rounded-[24px] border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl text-green-700">
                        ✉
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-green-900">
                          Save Your Report
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-green-800">
                          Enter your email to save your report and email a copy of the report to you. We'll also save it so you can come back anytime.
                        </p>
                      </div>
                    </div>

                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-6 h-16 w-full rounded-2xl border border-slate-300 bg-white px-5 text-lg outline-none focus:border-green-700"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-5 flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-700 to-green-600 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-60"
                    >
                      {submitting ? "Sending..." : "Save Report & Email Me a Copy"}
                    </button>

                    {saved && (
                      <div className="mt-4 rounded-2xl bg-green-100 px-4 py-3 text-sm font-semibold text-green-800">
                        Your report has been saved and emailed successfully.
                      </div>
                    )}

                    <p className="mt-5 text-xs text-slate-500">
                      We respect your privacy. Your information will never be shared.
                    </p>
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white shadow-lg">
                <div className="p-8">
                  <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-start gap-5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl text-green-700">
                        ↗
                      </div>

                      <div>
                        <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
                          Your Home Value Projection
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                          Based on a {appreciationRate}% average annual appreciation rate on your {formatter.format(homeValue)} home.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-green-100 bg-green-50 px-8 py-6 text-center shadow-sm">
                      <div className="text-base font-semibold text-slate-700">
                        Projected Value After {years} Years
                      </div>
                      <div className="mt-3 text-4xl font-black text-green-700 sm:text-5xl">
                        {formatter.format(finalProjection.value)}
                      </div>
                    </div>
                  </div>

                  <div className="h-[420px] rounded-3xl bg-white p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projection} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#dbe4dc" />
                        <XAxis dataKey="label" tick={{ fontSize: 14 }} />
                        <YAxis
                          tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                          tick={{ fontSize: 14 }}
                          width={80}
                        />
                        <Tooltip
                          formatter={(value) => [formatter.format(value), "Projected Value"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#15803d"
                          strokeWidth={4}
                          dot={{ r: 6, fill: "#15803d" }}
                          activeDot={{ r: 9 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200">
                    <table className="w-full min-w-[650px] text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-5 text-base font-black text-slate-700">
                            Year
                          </th>
                          {displayRows.map((row) => (
                            <th key={row.year} className="px-6 py-5 text-base font-black text-slate-700">
                              {row.label}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="border-t border-slate-200 bg-white">
                          <td className="px-6 py-5 text-base font-bold text-slate-900">
                            Home Value
                          </td>

                          {displayRows.map((row) => (
                            <td
                              key={row.year}
                              className={`px-6 py-5 text-base font-semibold ${
                                row.year === years ? "text-green-700" : "text-slate-700"
                              }`}
                            >
                              {formatter.format(row.value)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 rounded-3xl border border-green-100 bg-green-50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl text-green-700 shadow-sm">
                        ✓
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-green-900">
                          The Power of Homeownership
                        </h3>

                        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-700">
                          Home value appreciation is one of the key benefits of owning a home. Over time, it can build wealth and provide financial security for you and your family.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <p>
              This calculator is for informational purposes only and does not constitute financial advice. Actual results may vary.
            </p>

            <p className="mt-2">
              Churchill Mortgage Corporation | NMLS #1591
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
