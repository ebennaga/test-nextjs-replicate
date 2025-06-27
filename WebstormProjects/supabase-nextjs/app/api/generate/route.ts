import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { animal, phrase } = await req.json();

    const prompt = `a ${animal} wearing a t-shirt that says "${phrase}", centered, studio lighting`;

    const response = await fetch(
        "https://api.replicate.com/v1/models/bytedance/seedream-3/predictions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
                Prefer: "wait",
            },
            body: JSON.stringify({
                input: { prompt },
            }),
        }
    );

    const data = await response.json();
    console.log(data)
    return NextResponse.json({ output: data.output });
}
