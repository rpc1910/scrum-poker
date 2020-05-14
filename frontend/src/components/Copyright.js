import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Desenvolvido por "}
      <Link color="inherit" href="https://www.rodrigopassos.com.br/">
        Rodrigo Passos
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
