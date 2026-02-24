// src/app/api/weather/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude or Longitude missing" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&timezone=auto` +
      `&forecast_days=7`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Weather API failed");
    }

    const weatherData = await response.json();

    return NextResponse.json({
      current: {
        temperature: weatherData.current_weather?.temperature ?? null,
      },
      weekly: weatherData.daily.time.map((date: string, index: number) => ({
        date,
        temp_max: weatherData.daily.temperature_2m_max[index] ?? null,
        temp_min: weatherData.daily.temperature_2m_min[index] ?? null,
        rainfall:  weatherData.daily.precipitation_sum[index]  ?? 0,
      })),
    });

  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}