interface EmailTemplateProps {
  header: string;
  verificationLink: string;
}

export const EmailTemplate = ({
  header,
  verificationLink,
}: EmailTemplateProps) => (
  <div>
    <h1>{header}</h1> <br></br>
    <a href={verificationLink}>Click here to verify !</a>
  </div>
);
