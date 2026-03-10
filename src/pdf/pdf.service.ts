import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Product } from 'src/products/entities/products.entity';

@Injectable()
export class PdfService {
  async generateProductsPdf(
    products: Product[],
    categoryName: string,
  ): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
      });

      const page = await browser.newPage();

      await page.setContent(this.generateHtml(products));
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        margin: {
          top: '100px',
          bottom: '50px',
          left: '30px',
          right: '30px',
        },
        headerTemplate: `<div style="
      width: 100%;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
        <!-- Nome da empresa -->
        <div style="padding: 20px 30px;">
          <h1 style="
            margin: 0;
            color: #f97316;
            font-size: 22px;
          ">
            Sol a Sol
          </h1>
        </div>

        <!-- Categoria -->
        <div style="
          color: #f97316;
          padding: 20px 40px;
          font-weight: bold;
          font-size: 14px;
        ">
          ${categoryName}
        </div>
    </div>`,
        footerTemplate: `<div></div>`,
      });
      await browser.close();
      return Buffer.from(pdf);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao gerar pdf');
    }
  }

  private generateHtml(products: Product[]): string {
    return `
    <html>
        <head>
          <style>
            @page {
              size: A4;
            }

            body {
              font-family: Arial, sans-serif;
              padding-top: 0;
              margin: 0;
            }

            .container {
              padding: 20px 0;
            }

            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }

            .card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 10px;
              text-align: center;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            img {
              width: 100%;
              height: 150px;
              object-fit: cover;
              margin-bottom: 10px;
            }

            .name {
              font-weight: bold;
              margin-bottom: 5px;
            }

            .price {
              color: green;
              font-size: 14px;
            }
          </style>
        </head>

        <body>
        <div class="container">
          <div class="grid">
            ${products
              .map(
                (p) => `
                  <div class="card">
                    <img src="${p.imageUrl}" />
                    <div class="name">${p.name}</div>
                    <div class="price">R$ ${p.price}</div>
                  </div>
                `,
              )
              .join('')}
          </div>
          </div>
        </body>
      </html>
    `;
  }
}
