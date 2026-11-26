/* Grava o ícone e os dados da versão no Escritor.exe sem precisar do Wine
   (o electron-builder usa o rcedit, que no Linux só roda pelo Wine). */
const fs = require('fs'), path = require('path');
(async () => {
  const ResEdit = await import('resedit');
  const { NtExecutable, NtExecutableResource, Data, Resource } = ResEdit;
  const pkg = require('./package.json');
  const exe = path.join(__dirname, 'dist', 'win-unpacked', 'Escritor.exe');
  const bin = NtExecutable.from(fs.readFileSync(exe), { ignoreCert: true });
  const res = NtExecutableResource.from(bin);
  const ico = Data.IconFile.from(fs.readFileSync(path.join(__dirname, 'app', 'icons', 'icon.ico')));
  const grupos = Resource.IconGroupEntry.fromEntries(res.entries);
  const id = grupos.length ? grupos[0].id : 1, lang = grupos.length ? grupos[0].lang : 1033;
  Resource.IconGroupEntry.replaceIconsForResource(res.entries, id, lang, ico.icons.map((i) => i.data));
  const [vi] = Resource.VersionInfo.fromEntries(res.entries);
  if (vi) {
    const [a, b, c] = pkg.version.split('.').map(Number);
    vi.setFileVersion(a, b, c, 0, lang); vi.setProductVersion(a, b, c, 0, lang);
    for (const l of vi.getAllLanguagesForStringValues()) {
      vi.setStringValues(l, { ProductName: 'Escritor', FileDescription: 'Escritor', CompanyName: 'GR Brands',
        LegalCopyright: 'GR Brands', OriginalFilename: 'Escritor.exe', InternalName: 'Escritor' });
    }
    vi.outputToResourceEntries(res.entries);
  }
  res.outputResource(bin);
  fs.writeFileSync(exe, Buffer.from(bin.generate()));
  console.log('ícone e versão gravados em', exe);
})();
