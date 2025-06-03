-- CreateTable
CREATE TABLE "request_share_links" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "accessedAt" TIMESTAMP(3),

    CONSTRAINT "request_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "request_share_links_token_key" ON "request_share_links"("token");

-- AddForeignKey
ALTER TABLE "request_share_links" ADD CONSTRAINT "request_share_links_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "document_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
