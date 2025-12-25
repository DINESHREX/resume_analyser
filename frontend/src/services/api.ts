import { FullAnalysisResponse } from "@/types/api";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const analyzeResume = async (
  file: File,
  jdText: string
): Promise<FullAnalysisResponse> => {
  const formData = new FormData();
  formData.append("resume_file", file);
  formData.append("jd_text", jdText);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to analyze resume");
  }

  return response.json();
};
