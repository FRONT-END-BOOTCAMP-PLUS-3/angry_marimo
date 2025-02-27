import { NextRequest, NextResponse } from "next/server";

export async function GET () {
  const response = NextResponse.json("/")
}

export async function POST (request : NextRequest) {

}