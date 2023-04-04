import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import Container from "components/organisms/Container";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "" }: Props) => (
  <div className='px-5 py-4 bg-black font-worksans h-screen'>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Container>{children}</Container>
  </div>
);

export default Layout;
