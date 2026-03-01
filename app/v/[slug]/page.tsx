import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import VideoViewerClient from "./VideoViewerClient"

export default async function VideoViewerPage({
  params,
}: {
  params: { slug: string }
}) {
  const qrLink = await prisma.qrLink.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      order: {
        include: {
          deliveryAssets: {
            where: { type: "mp4" },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  })

  if (!qrLink) {
    notFound()
  }

  // Update view count
  await prisma.qrLink.update({
    where: { id: qrLink.id },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date(),
    },
  })

  return <VideoViewerClient qrLink={qrLink} />
}

