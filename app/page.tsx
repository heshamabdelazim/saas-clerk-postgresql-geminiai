import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { features, steps } from "./data/data";
import { CheckCircle } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container max-w-4xl px-4 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
            AI-Powered Document Analysis for Everyone
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Teams</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, Analyze, and collaborate on documents with your organization. Get instant AI insights and summarize.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href="/sign-up">
              <Button size="lg" className="px-8">
                Start free trial
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="px-8">
                Sign In
              </Button>
            </Link>

          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, ind) => (
              <Card key={ind} className="border-none shadow-sm">
                <CardHeader>
                  <div className="inline-flex items-center justify-center p-3 bg-blue-100">
                    <div className="text-blue-600">
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="space-y-4 max-w-md mx-auto">
            {steps.map((step, ind) => (
              <div key={ind} className="flex items-center gap-4 p-4 bg-white border rounded-lg">
                <div className="shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-50 to-indigo-50">
        <div className=" container max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to analyze your documents?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of team using DocuAI to work smarter with their documents.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="px-8">Get started free</Button>
            <p className="text-sm text-gray-500 mt-4">No Credit card required - 14 days free trial</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
