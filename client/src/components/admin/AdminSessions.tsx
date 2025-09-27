import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronLeft, 
  ChevronRight, 
  Database,
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface CaptchaSession {
  id: string;
  captcha_code: string;
  used: boolean;
  expires_at: string;
  created_at: string;
}

interface UserSession {
  session_id: string;
  expires: number;
  data_preview: string;
  expires_date: string;
}

interface CaptchaSessionsResponse {
  sessions: CaptchaSession[];
  total: number;
}

interface UserSessionsResponse {
  sessions: UserSession[];
  total: number;
}

export default function AdminSessions() {
  const [captchaPage, setCaptchaPage] = useState(1);
  const [userSessionPage, setUserSessionPage] = useState(1);
  const itemsPerPage = 10;

  const { data: captchaData, isLoading: captchaLoading } = useQuery({
    queryKey: ["admin-captcha-sessions", captchaPage],
    queryFn: async () => {
      const response = await fetch(`/api/admin/captcha-sessions?page=${captchaPage}&limit=${itemsPerPage}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch captcha sessions");
      }
      
      return response.json() as Promise<CaptchaSessionsResponse>;
    },
  });

  const { data: userSessionData, isLoading: userSessionLoading } = useQuery({
    queryKey: ["admin-user-sessions", userSessionPage],
    queryFn: async () => {
      const response = await fetch(`/api/admin/sessions?page=${userSessionPage}&limit=${itemsPerPage}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user sessions");
      }
      
      return response.json() as Promise<UserSessionsResponse>;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUnixDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const captchaTotalPages = Math.ceil((captchaData?.total || 0) / itemsPerPage);
  const userSessionTotalPages = Math.ceil((userSessionData?.total || 0) / itemsPerPage);

  const CaptchaSessions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Captcha Sessions</span>
        </CardTitle>
        <CardDescription>
          Monitor captcha generation and verification sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {captchaLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Captcha Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires At</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {captchaData?.sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <Shield className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No captcha sessions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    captchaData?.sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-sm">
                          {session.id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {session.captcha_code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {session.used ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Used
                                </Badge>
                              </>
                            ) : isExpired(session.expires_at) ? (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <Badge variant="destructive">
                                  Expired
                                </Badge>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 text-blue-600" />
                                <Badge variant="secondary">
                                  Active
                                </Badge>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(session.expires_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(session.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Captcha Pagination */}
            {captchaTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((captchaPage - 1) * itemsPerPage) + 1} to {Math.min(captchaPage * itemsPerPage, captchaData?.total || 0)} of {captchaData?.total || 0} sessions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCaptchaPage(prev => Math.max(prev - 1, 1))}
                    disabled={captchaPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(captchaTotalPages, 5))].map((_, i) => {
                      const pageNum = captchaPage <= 3 ? i + 1 : captchaPage - 2 + i;
                      if (pageNum > captchaTotalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={captchaPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCaptchaPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCaptchaPage(prev => Math.min(prev + 1, captchaTotalPages))}
                    disabled={captchaPage === captchaTotalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  const UserSessions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>User Sessions</span>
        </CardTitle>
        <CardDescription>
          Monitor active user authentication sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userSessionLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Data Preview</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userSessionData?.sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <Database className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No user sessions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    userSessionData?.sessions.map((session) => (
                      <TableRow key={session.session_id}>
                        <TableCell className="font-mono text-sm">
                          {session.session_id.slice(0, 12)}...
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground max-w-xs truncate">
                            {session.data_preview}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {session.expires * 1000 > Date.now() ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Active
                                </Badge>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <Badge variant="destructive">
                                  Expired
                                </Badge>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatUnixDate(session.expires)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* User Sessions Pagination */}
            {userSessionTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((userSessionPage - 1) * itemsPerPage) + 1} to {Math.min(userSessionPage * itemsPerPage, userSessionData?.total || 0)} of {userSessionData?.total || 0} sessions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserSessionPage(prev => Math.max(prev - 1, 1))}
                    disabled={userSessionPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(userSessionTotalPages, 5))].map((_, i) => {
                      const pageNum = userSessionPage <= 3 ? i + 1 : userSessionPage - 2 + i;
                      if (pageNum > userSessionTotalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={userSessionPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUserSessionPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserSessionPage(prev => Math.min(prev + 1, userSessionTotalPages))}
                    disabled={userSessionPage === userSessionTotalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sessions Management</h2>
        <p className="text-muted-foreground">
          Monitor captcha sessions and user authentication sessions
        </p>
      </div>

      <Tabs defaultValue="captcha" className="space-y-4">
        <TabsList>
          <TabsTrigger value="captcha" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Captcha Sessions</span>
            <Badge variant="secondary" className="ml-2">
              {captchaData?.total || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="user-sessions" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>User Sessions</span>
            <Badge variant="secondary" className="ml-2">
              {userSessionData?.total || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="captcha">
          <CaptchaSessions />
        </TabsContent>
        
        <TabsContent value="user-sessions">
          <UserSessions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
