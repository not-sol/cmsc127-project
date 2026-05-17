export function getReportIdFromSearchParams(searchParams: URLSearchParams) {
  const reportId = Number(searchParams.get("reportId"));
  return Number.isFinite(reportId) && reportId > 0 ? reportId : undefined;
}

export function getReportEditorPath(reportId?: number) {
  return reportId ? `/reports/create-report?reportId=${reportId}` : "/reports/create-report";
}

export function getEntryFormPath(route: string, reportId?: number, entryId?: number) {
  const params = new URLSearchParams();

  if (reportId) params.set("reportId", String(reportId));
  if (entryId) params.set("entryId", String(entryId));

  const query = params.toString();
  return query ? `${route}?${query}` : route;
}
