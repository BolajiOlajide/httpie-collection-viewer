"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Upload,
  ChevronDown,
  ChevronRight,
  Globe,
  Key,
  FileText,
  Code,
  Copy,
  Check,
  Star,
  Heart,
  Zap,
  Shield,
} from "lucide-react"

interface HTTPieHeader {
  name: string
  value: string
  enabled?: boolean
}

interface HTTPieQueryParam {
  name: string
  value: string
  enabled?: boolean
}

interface HTTPiePathParam {
  name: string
  value: string
}

interface HTTPieAuthCredentials {
  username: string
  password: string
}

interface HTTPieAuth {
  type: "none" | "inherited" | "bearer" | "basic" | "digest"
  target?: "headers" | "query"
  credentials?: HTTPieAuthCredentials
}

interface HTTPieBodyText {
  value: string
  format: string
}

interface HTTPieBodyForm {
  isMultipart: boolean
  fields: Array<{
    name: string
    value: string
    enabled?: boolean
  }>
}

interface HTTPieBodyFile {
  name: string
}

interface HTTPieBodyGraphQL {
  query: string
  variables: string
}

interface HTTPieBody {
  type: "text" | "form" | "file" | "graphql"
  text: HTTPieBodyText
  form: HTTPieBodyForm
  file: HTTPieBodyFile
  graphql: HTTPieBodyGraphQL
}

interface HTTPieRequest {
  name: string
  url: string
  method: string
  headers: HTTPieHeader[]
  queryParams: HTTPieQueryParam[]
  pathParams: HTTPiePathParam[]
  auth: HTTPieAuth
  body: HTTPieBody
  description?: string
}

interface HTTPieIcon {
  name: string
  color: string
}

interface HTTPieEntry {
  name: string
  icon: HTTPieIcon
  auth: HTTPieAuth
  requests: HTTPieRequest[]
}

interface HTTPieMeta {
  format: string
  version: string
  contentType: string
  schema: string
  docs: string
  source: string
}

interface HTTPieCollection {
  meta: HTTPieMeta
  entry: HTTPieEntry
}

const methodColors = {
  GET: "bg-green-100 text-green-800 border-green-200",
  POST: "bg-blue-100 text-blue-800 border-blue-200",
  PUT: "bg-orange-100 text-orange-800 border-orange-200",
  DELETE: "bg-red-100 text-red-800 border-red-200",
  PATCH: "bg-purple-100 text-purple-800 border-purple-200",
  HEAD: "bg-gray-100 text-gray-800 border-gray-200",
  OPTIONS: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

const iconMap = {
  star: Star,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  globe: Globe,
}

const colorMap = {
  purple: "text-purple-600",
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  yellow: "text-yellow-600",
  orange: "text-orange-600",
  pink: "text-pink-600",
  gray: "text-gray-600",
}

export default function CollectionViewer() {
  const [collection, setCollection] = useState<HTTPieCollection | null>(null)
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")
  const [expandedRequests, setExpandedRequests] = useState<Set<number>>(new Set())
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonInput(content)
        parseCollection(content)
      }
      reader.readAsText(file)
    }
  }

  const parseCollection = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)
      setCollection(data)
      setError("")
    } catch (err) {
      setError("Invalid JSON format. Please check your HTTPie collection file.")
      setCollection(null)
    }
  }

  const toggleRequest = (index: number) => {
    const newExpanded = new Set(expandedRequests)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRequests(newExpanded)
  }

  const copyToClipboard = async (text: string, url: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2)
  }

  const getEffectiveAuth = (requestAuth: HTTPieAuth, collectionAuth: HTTPieAuth) => {
    if (requestAuth.type === "inherited") {
      return collectionAuth
    }
    return requestAuth
  }

  const renderAuthInfo = (auth: HTTPieAuth, isInherited = false) => {
    if (!auth || auth.type === "none") {
      return <p className="text-slate-500 text-sm">No authentication configured</p>
    }

    return (
      <div className="p-3 bg-slate-50 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Type:</span>
          <Badge variant="outline">{auth.type}</Badge>
          {isInherited && (
            <Badge variant="secondary" className="text-xs">
              Inherited
            </Badge>
          )}
        </div>
        {auth.target && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Target:</span>
            <Badge variant="secondary">{auth.target}</Badge>
          </div>
        )}
        {auth.credentials?.username && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Username:</span>
            <code className="text-sm">{auth.credentials.username}</code>
          </div>
        )}
        {auth.credentials?.password && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{auth.type === "bearer" ? "Token:" : "Password:"}</span>
            <code className="text-sm break-all">{auth.type === "bearer" ? auth.credentials.password : "••••••••"}</code>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">HTTPie Collection Viewer</h1>
          <p className="text-slate-600">Upload and explore your HTTPie collections with style</p>
          <div className="mt-4">
            <a
              href="https://github.com/BolajiOlajide/httpie-collection-viewer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        {!collection && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Load HTTPie Collection
              </CardTitle>
              <CardDescription>Upload a JSON file or paste your HTTPie collection data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                  Upload JSON File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or paste JSON</span>
                </div>
              </div>

              <div>
                <Textarea
                  placeholder="Paste your HTTPie collection JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              <Button onClick={() => parseCollection(jsonInput)} className="w-full" disabled={!jsonInput.trim()}>
                Parse Collection
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}
            </CardContent>
          </Card>
        )}

        {collection && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {collection.entry.icon && (
                    <>
                      {iconMap[collection.entry.icon.name as keyof typeof iconMap] &&
                        React.createElement(iconMap[collection.entry.icon.name as keyof typeof iconMap], {
                          className: `w-6 h-6 ${colorMap[collection.entry.icon.color as keyof typeof colorMap] || "text-gray-600"}`,
                        })}
                    </>
                  )}
                  {collection.entry.name}
                </CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{collection.entry.requests?.length || 0} requests</span>
                    <span>HTTPie {collection.meta.version}</span>
                    <span>{collection.meta.source}</span>
                  </div>
                  {collection.entry.auth && collection.entry.auth.type !== "none" && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Collection Auth:</span>
                      <Badge variant="outline">{collection.entry.auth.type}</Badge>
                    </div>
                  )}
                </CardDescription>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCollection(null)}>
                    Load New Collection
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {collection.entry.requests?.map((request, index) => {
                const effectiveAuth = getEffectiveAuth(request.auth, collection.entry.auth)
                const isAuthInherited = request.auth.type === "inherited"

                return (
                  <Card key={index} className="overflow-hidden">
                    <Collapsible>
                      <CollapsibleTrigger className="w-full" onClick={() => toggleRequest(index)}>
                        <CardHeader className="hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {expandedRequests.has(index) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <Badge
                                variant="outline"
                                className={`${methodColors[request.method as keyof typeof methodColors] || "bg-gray-100 text-gray-800"} font-mono`}
                              >
                                {request.method}
                              </Badge>
                              <div className="text-left">
                                <CardTitle className="text-lg">{request.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="text-sm bg-slate-100 px-2 py-1 rounded">{request.url}</code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      copyToClipboard(request.url, request.url)
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    {copiedUrl === request.url ? (
                                      <Check className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                  {effectiveAuth && effectiveAuth.type !== "none" && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Key className="w-3 h-3 mr-1" />
                                      {effectiveAuth.type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          {request.description && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">{request.description}</p>
                            </div>
                          )}

                          <Tabs defaultValue="headers" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                              <TabsTrigger value="headers" className="flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                Headers
                              </TabsTrigger>
                              <TabsTrigger value="params" className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Params
                              </TabsTrigger>
                              <TabsTrigger value="auth" className="flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                Auth
                              </TabsTrigger>
                              <TabsTrigger value="body" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Body
                              </TabsTrigger>
                              <TabsTrigger value="raw" className="flex items-center gap-2">
                                <Code className="w-4 h-4" />
                                Raw
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="headers" className="mt-4">
                              {request.headers && request.headers.length > 0 ? (
                                <div className="space-y-2">
                                  {request.headers.map((header, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                                      <code className="text-sm font-medium text-slate-700">{header.name}:</code>
                                      <code className="text-sm text-slate-600">{header.value}</code>
                                      {header.enabled === false && (
                                        <Badge variant="secondary" className="text-xs">
                                          Disabled
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-sm">No headers defined</p>
                              )}
                            </TabsContent>

                            <TabsContent value="params" className="mt-4">
                              <div className="space-y-4">
                                {request.queryParams && request.queryParams.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Query Parameters</h4>
                                    <div className="space-y-2">
                                      {request.queryParams.map((param, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                                          <code className="text-sm font-medium text-slate-700">{param.name}:</code>
                                          <code className="text-sm text-slate-600">{param.value}</code>
                                          {param.enabled === false && (
                                            <Badge variant="secondary" className="text-xs">
                                              Disabled
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {request.pathParams && request.pathParams.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Path Parameters</h4>
                                    <div className="space-y-2">
                                      {request.pathParams.map((param, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                                          <code className="text-sm font-medium text-slate-700">{param.name}:</code>
                                          <code className="text-sm text-slate-600">{param.value}</code>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {(!request.queryParams || request.queryParams.length === 0) &&
                                  (!request.pathParams || request.pathParams.length === 0) && (
                                    <p className="text-slate-500 text-sm">No parameters defined</p>
                                  )}
                              </div>
                            </TabsContent>

                            <TabsContent value="auth" className="mt-4">
                              {renderAuthInfo(effectiveAuth, isAuthInherited)}
                            </TabsContent>

                            <TabsContent value="body" className="mt-4">
                              {request.body ? (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Body Type:</span>
                                    <Badge variant="outline">{request.body.type}</Badge>
                                  </div>

                                  {request.body.type === "text" && request.body.text?.value && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium">Format:</span>
                                        <Badge variant="secondary">{request.body.text.format}</Badge>
                                      </div>
                                      <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto">
                                        <code>
                                          {request.body.text.format === "application/json"
                                            ? formatJson(JSON.parse(request.body.text.value))
                                            : request.body.text.value}
                                        </code>
                                      </pre>
                                    </div>
                                  )}

                                  {request.body.type === "form" && request.body.form && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium">Multipart:</span>
                                        <Badge variant={request.body.form.isMultipart ? "default" : "secondary"}>
                                          {request.body.form.isMultipart ? "Yes" : "No"}
                                        </Badge>
                                      </div>
                                      {request.body.form.fields && request.body.form.fields.length > 0 ? (
                                        <div className="space-y-2">
                                          {request.body.form.fields.map((field, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                                              <code className="text-sm font-medium text-slate-700">{field.name}:</code>
                                              <code className="text-sm text-slate-600">{field.value}</code>
                                              {field.enabled === false && (
                                                <Badge variant="secondary" className="text-xs">
                                                  Disabled
                                                </Badge>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-slate-500 text-sm">No form fields defined</p>
                                      )}
                                    </div>
                                  )}

                                  {request.body.type === "file" && request.body.file && (
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                      <span className="text-sm">
                                        File: {request.body.file.name || "No file selected"}
                                      </span>
                                    </div>
                                  )}

                                  {request.body.type === "graphql" && request.body.graphql && (
                                    <div className="space-y-3">
                                      <div>
                                        <h4 className="font-medium text-sm mb-2">Query</h4>
                                        <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto">
                                          <code>{request.body.graphql.query || "No query defined"}</code>
                                        </pre>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-sm mb-2">Variables</h4>
                                        <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto">
                                          <code>{request.body.graphql.variables || "No variables defined"}</code>
                                        </pre>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-sm">No body content</p>
                              )}
                            </TabsContent>

                            <TabsContent value="raw" className="mt-4">
                              <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto">
                                <code>{formatJson(request)}</code>
                              </pre>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
