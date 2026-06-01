import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userImage, garmentImage } = await req.json()

    if (!userImage || !garmentImage) {
      return NextResponse.json(
        { error: 'Missing required images' },
        { status: 400 }
      )
    }

    console.log('[v0] Starting AI try-on')

    // Check if Replicate API token is available
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        const { default: Replicate } = await import('replicate')
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        })

        // Use IDM-VTON model for virtual try-on
        const output = await replicate.run(
          'cuuuomua/idm-vton:556c0b13f04547a784a37f18d9979cebc47c1cfc4b37d1d2da826c7314549f53',
          {
            input: {
              human_img: userImage,
              garm_img: garmentImage,
              n_steps: 20,
              guidance_scale: 2.0,
            },
          }
        )

        console.log('[v0] AI try-on completed with Replicate:', output)
        return NextResponse.json({ result: output })
      } catch (replicateError: any) {
        console.error('[v0] Replicate error:', replicateError)
        // Fall through to demo mode
      }
    }

    // Demo mode: return the garment image as the "result" for preview
    console.log('[v0] AI try-on demo mode - returning garment preview')
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return NextResponse.json({ 
      result: garmentImage,
      demo: true,
      message: 'Demo mode - showing garment preview. Set REPLICATE_API_TOKEN for full AI try-on.'
    })
  } catch (error: any) {
    console.error('[v0] Try-on error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process try-on' },
      { status: 500 }
    )
  }
}
