"use client";

import React from "react";
import { DashboardProvider } from "./dashboard-context";
import { DashboardLayoutShell } from "./dashboard-layout-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <DashboardLayoutShell>
                {children}
            </DashboardLayoutShell>
        </DashboardProvider>
    );
}
